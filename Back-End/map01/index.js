const API_KEY = 'AIzaSyDp384GSknnjuAe0sa5ythFd5Ou-fvy4Ns';
let map, userMarker;
const locations = [];
let parking_list = [];
let disableSearch = false; // Add flag to control bounds_changed trigger

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

  // User marker setup
  userMarker = new google.maps.Marker({
    position: center,
    map: map,
    title: 'You',
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
      fields: ['geometry', 'name', 'rating'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
          parking_list.push({
            name: place.name,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            rating: place.rating || "No rating available",
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
  }
}

function loadGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap&libraries=places`;
  script.async = true;
  document.head.appendChild(script);
}

loadGoogleMapsScript();
