// // npm install @vitejs/plugin-react  
// Google Maps API Key
const API_KEY = 'API';
let map, userMarker;
const locations = [];

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
        // Set a default location if geolocation fails
        const defaultPos = { lat: 42.391155, lng: -72.526711 };
        createMap(defaultPos);
      }
    );
  } else {
    // Geolocation not available
    const defaultPos = { lat: 42.391155, lng: -72.526711 };
    createMap(defaultPos);
  }
}

// Function to initialize the Google Map
function createMap(center) {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: center,
    mapId: 'da37f3254c6a6d1c',
  });

  // Set up the user location marker
  userMarker = new google.maps.Marker({
    position: center,
    map: map,
    title: 'You',
  });

  // Initialize search box
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

    // Create bounds that include both user and searched location
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(userMarker.getPosition()); // Add the user's location to bounds

    // Add a marker for each selected place and extend bounds to include it
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
      bounds.extend(place.geometry.location);
    });

    // Adjust the map to fit all markers
    map.fitBounds(bounds);
  });
}

// Load Google Maps Script
function loadGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap&libraries=places`;
  script.async = true;
  document.head.appendChild(script);
}

loadGoogleMapsScript();
