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
    zoom: 13,
    center: center,
    mapId: 'da37f3254c6a6d1c',
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
    console.log(d);
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
      fields: ['geometry', 'name', 'rating', 'place_id'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
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
          });

          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
          });
          parkingMarkers.push(marker);
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
  // const input = document.getElementsByClassName("search-bar")
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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
    }
    .search-bar input {
      width: 80%;
      padding: 10px;
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
