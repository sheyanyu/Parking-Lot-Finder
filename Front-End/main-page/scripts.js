import { initMap } from '../../Back-End/map01/index.js';

// Wait for the document to load fully before executing the code
document.addEventListener("DOMContentLoaded", function () {
    // Get the current location and initialize the map
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       // Replace the map container with Google Map using initMap()
    //       const pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude,
    //       };
    //       // Call the initMap function from index.js
    //       window.initMapWithPosition(pos);
    //     },
    //     (error) => {
    //       console.error("Error getting location:", error);
    //     }
    //   );
    // } else {
    //   console.error("Geolocation is not supported by this browser.");
    // }
    initMap();

    // Add an event listener to update the parking list when data is ready
    document.addEventListener("parkingListUpdated", function (event) {
      const parkingListContainer = document.getElementById("parking-list");
      parkingListContainer.innerHTML = ""; // Clear existing content
  
      const parkingList = event.detail;
  
      // Create div elements for each parking lot in the returned list
      parkingList.forEach((parkingLot, index) => {
        const parkingDiv = document.createElement("div");
        parkingDiv.classList.add("parking-lot-info");
        parkingDiv.innerHTML = `
          <p class="parking-lot-name">${index + 1}. ${parkingLot.name} <span class="distance">(${parkingLot.location.lat}, ${parkingLot.location.lng})</span></p>
          <p>Rating: ${parkingLot.rating ? parkingLot.rating : "No rating available"}</p>
        `;
        parkingListContainer.appendChild(parkingDiv);
      });
    });
  });
  