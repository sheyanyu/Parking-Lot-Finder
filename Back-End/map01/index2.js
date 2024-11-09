// import { returnLocation } from "../../Front-End/main-page/scripts.js";

// const selected = { lat: 42.391155, lng: -72.526711 }; //待修改
// params example: "42.38647449999999,-72.52137909999999"
let selected = {lat: 42.386474, lng: -72.521379}; //defaulted Location
const params = new URLSearchParams(window.location.search);
console.log(params);

if (params.size > 0){
  const lat = Math.round(params.get("lat") * 1000000) / 1000000;
  const lng = Math.round(params.get("lng") * 1000000) / 1000000;
  selected = { lat, lng };  //Update lot's location
  console.log(selected);
}

let newMap; // Use a different map variable
const API_KEY = 'AIzaSyDp384GSknnjuAe0sa5ythFd5Ou-fvy4Ns';

// document.addEventListener("DOMContentLoaded", ()=> {
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
  // loadNewGoogleMapsScript();
  
  function loadNewGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initNewMap&libraries=places`;
    script.async = true;
    document.head.appendChild(script);
  }
// });

