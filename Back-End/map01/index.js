const API_KEY = 'AIzaSyDp384GSknnjuAe0sa5ythFd5Ou-fvy4Ns';
let map;
const locations = [];
let parking_list = [];
let disableSearch = false;

// Get current location and initialize map
function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        locations.push({ key: 'You', location: pos });
        createMap(pos); // Initialize map with user's location

        // Add a custom colored marker for the user's location
        const userMarker = new google.maps.Marker({
          position: pos,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          title: 'Your Location',
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        const defaultPos = { lat: 42.391155, lng: -72.526711 };
        createMap(defaultPos);
      }
    );
  } else {
    const defaultPos = { lat: 42.391155, lng: -72.526711 };
    createMap(defaultPos);
  }
}


function createMap(center) {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: center,
    mapId: 'da37f3254c6a6d1c',
    mapTypeControl: false,
    streetViewControl: false
  });

  let parkingMarkers = [];

  // Add a listener to fetch parking whenever the bounds of the map change
  map.addListener('bounds_changed', () => {
    if (disableSearch) {
      return; 
    }

    if (this.boundsChangedTimeout) {
      clearTimeout(this.boundsChangedTimeout);
    }
    this.boundsChangedTimeout = setTimeout(() => {
      const bounds = map.getBounds();
      if (bounds) {
        SearchParking(bounds);
      }
    }, 500);
  });

  function calculate_distance(point1, point2){
    const lat1 = point1.lat;
    const lng1 = point1.lng;
    const lat2 = point2.lat();
    const lng2 = point2.lng();
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lng2 - lng1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Function to search for parking spots in the current bounds
  async function SearchParking(bounds) {
    // Clear previous parking markers
    parkingMarkers.forEach((marker) => marker.setMap(null));
    parkingMarkers = [];
    parking_list = [];

    const service = new google.maps.places.PlacesService(map);

    const request = {
      bounds: bounds,
      type: ['parking'],
      fields: ['geometry', 'name', 'rating', 'place_id', 'vicinity'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const limitLoc = results.slice(0,6);
        let index = 1;
        limitLoc.forEach((place) => {
          console.log(place.vicinity);
          if (place.geometry && place.geometry.location) {
            distance = calculate_distance(locations[0].location, place.geometry.location);
          } else {
            console.log("Invalid place geometry.");
          }
          
          distance = calculate_distance(locations[0].location, place.geometry.location);
          parking_list.push({
            name: place.name,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            rating: place.rating || "No rating available",
            place_id: place.place_id || 'no place_id available',
            // in km
            distance: distance, 
            address: place.vicinity || 'no address available',
          });

          const customIcon = {
            url: `./marker${index}.png`, // 自定义图标的 URL
            scaledSize: new google.maps.Size(40, 40), // 设定与谷歌默认 marker 相似的尺寸 (40px 高)
            anchor: new google.maps.Point(20, 40), // 设置锚点，通常为图标底部中心
          };

          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: customIcon,
          });
          parkingMarkers.push(marker);
          index++;
        });

        emitParkingList();
        console.log(parking_list)
      } else {
        console.log("No parking results found or an error occurred.");
      }
    });
  }

  function emitParkingList() {
    const event = new CustomEvent('parkingListUpdated', { detail: parking_list });
    document.dispatchEvent(event);
    console.log("create event");
    console.log(event);
  }

  // Initialize search box
  const input = document.createElement('div');
  input.classList.add('search-bar');
  input.innerHTML = `
    <input id="pac-input" type="text" placeholder="Search for places...">
    <button class="search-btn">🔍</button>
  `;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  const searchBoxInput = input.querySelector('#pac-input');
  const searchBox = new google.maps.places.SearchBox(searchBoxInput);

  // Adjust the bounds of the search box
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = []; // Array to hold the searched location markers

  // Handle the event when a place is selected from the search box
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    // Clear previous markers
    markers.forEach((marker) => marker.setMap(null));
    markers = [];

    // Add a marker for each selected place
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location,
      });
      markers.push(marker);
    });

    // Adjust the map to fit the selected place
    if (places[0] && places[0].geometry) {
      map.setCenter(places[0].geometry.location);
      map.setZoom(15);
    }
  });
}

function loadGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap&libraries=places`;
  script.async = true;
  document.head.appendChild(script);
}

loadGoogleMapsScript();

// CSS for search bar styling
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .search-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 65%; /* Adjusts the overall container width to take full space */
      padding: 10px; /* Adds padding to the search bar container */
      box-sizing: border-box; /* Includes padding in the total width */

    }
    .search-bar input {
      flex: 1; /* Makes input take up all available space */
      padding: 15px;
      font-size: 1em;
      border: 1px solid #ccc;
      border-radius: 20px;
      outline: none;
    }
    .search-btn {
      background: none;
      border: none;
      font-size: 1.5em;
      cursor: pointer;
      color: #888;
      margin-left: -40px;
    }
  </style>
`);


