const selected = { lat: 42.391155, lng: -72.526711 }; //待修改
let newMap; // Use a different map variable
const API_KEY = 'AIzaSyDp384GSknnjuAe0sa5ythFd5Ou-fvy4Ns';

function initNewMap() {
  // Ensure that the map container exists before initializing the map
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error('Map container not found.');
    return;
  }

  newMap = new google.maps.Map(mapElement, {
    zoom: 17.5,
    center: selected,
  });

  // Add a marker for the selected parking location
  const selectedMarker = new google.maps.Marker({
    position: selected,
    map: newMap,
    title: 'Selected Parking Location',
  });
}

// Load Google Maps Script after DOM is fully loaded
window.addEventListener('DOMContentLoaded', loadNewGoogleMapsScript);

function loadNewGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initNewMap&libraries=places`;
  script.async = true;
  document.head.appendChild(script);
}
