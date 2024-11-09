import { initMap } from '../../Back-End/map01/index.js';

// Wait for the document to load fully before executing the code
document.addEventListener("DOMContentLoaded", () => {
    console.log(111);
    // initMap();
    SearchParking(1000);


    // Add an event listener to update the parking list when data is ready
document.addEventListener("parkingListUpdated", (event) => {
    console.log('333');
    const parkingListContainer = document.getElementById("parking-list");
    parkingListContainer.innerHTML = ""; // Clear existing content
  
    const parkingList = event.detail;
  


    // Create div elements for each parking lot in the returned list
parkingList.forEach((parkingLot) => {
  const parkingDiv = document.createElement("div");
  parkingDiv.classList.add("parking-lot-info");

const lotName = document.createElement('p');
lotName.textContent = parkingLot.name;
lotName.classList.add('parking-lot-name');

const lotDistance = document.createElement('span');
const distanceContent = "<" + "100" + "m";
lotDistance.textContent = distanceContent;
lotDistance.classList.add('distance');

const lotInfo = document.createElement('p');
infoContent = "Availability: " + "20" + "%    " + "Price: $" + "25" + "/hr, $" + "100" + "/day";
lotInfo.textContent = infoContent;
// lotInfo.classList.add('parking-lot-name');

parkingDiv.appendChild(lotName);
parkingDiv.appendChild(lotDistance);
parkingDiv.appendChild(lotInfo);

parkingListContainer.appendChild(parkingDiv);


});
  });


const posts = document.querySelector(".parking-lot-info");
posts.addEventListener("click", () => {window.location.href = '../detail-page/index.html';});



});



  