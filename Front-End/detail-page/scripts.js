// import {loadNewGoogleMapsScript} from "../../Back-End/map01/index2.js";
//const query = `lat=${parkingLot.location.lat}&lng=${parkingLot.location.lng}&name=${parkingLot.name}
// &id=${parkingLot.place_id}&distance=${parkingLot.distance}&rate=${parkingLot.rating}`;
const params = new URLSearchParams(window.location.search);
const place_id = params.get("id");
const name = params.get("name");
const googleRate = params.get("rate");
const distance = params.get("distance");
const address = params.get("address")
//Access parking lot data from two database.
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Page loaded.");
    // const idSet = {id: placec_id}
    try {
      // Fetch data from the backend
      const response = await fetch(`http://localhost:3000/items?id=${place_id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });
      
        if (response.ok) {
        const parkingLots = await response.json();
        console.log("Fetched Parking Lots:", parkingLots);
        } else {
        console.error("Failed to fetch parking lots:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching parking lot data:", error);
      }

    //Creating Parking Lot detail block
    const detailContainer = document.querySelector(".parking-card");

    const lotName = document.createElement('h1');
    // const parkingLotName = "Parking Lot Example"
    const parkingLotName = name;
    lotName.textContent = parkingLotName;
    // lotName.classList.add('parking-lot-name');

    const lotDistance = document.createElement('p');
    const distanceContent = distance;
    lotDistance.textContent = `<${distanceContent}m`;
    lotDistance.classList.add('distance');

    const lotAddress = document.createElement('p');
    const parkingLotAddress = address;
    lotAddress.textContent = parkingLotAddress;
    // lotInfo.classList.add('parking-lot-name');


    const lotAvailability = document.createElement('p');
    const availabilityPersent = parkingLots.availability;
    const parkingLotAvailability = `Availability: ${availabilityPersent}%`;
    lotAvailability.textContent = parkingLotAvailability;
    // lotInfo.classList.add('parking-lot-name');

    const lotRate = document.createElement('p');

        const starSpan = document.createElement('span');
        if(parkingLots.rate != null) {const rate = parkingLots.rate}
        else if (googleRate != null) {const rate = googleRate}
        else {const rate = 0; starSpan.innerHTML += "None";}

        for (let i = rate; i>0; i--) {
            starSpan.innerHTML += "⭐";
        }
        
    lotRate.textContent = "Rate: ";
    lotRate.appendChild(starSpan);
    // lotInfo.classList.add('parking-lot-name');




    const lotPrice = document.createElement('p');
    const price = parkingLots.price;
    const parkingLotPrice = `Price: $${price}/hour`;
    lotPrice.textContent = parkingLotPrice;
    // lotInfo.classList.add('parking-lot-name');

    const lotRisk = document.createElement('p');
    const risk = "low";
    const parkingLotRisk = `Risk: ${risk}`;
    lotRisk.textContent = parkingLotRisk;
    // lotInfo.classList.add('parking-lot-name');
    


    const chartDiv1 = document.createElement('div');
    chartDiv1.className = 'chart';

    // Create the image element
    const imgElement1 = document.createElement('img');
    imgElement1.src = '曲线图.jpg';
    imgElement1.alt = 'Availability graph';
    imgElement1.style.width = '100%';
    imgElement1.style.height = 'auto';

    // Append the image to the chart container div
    chartDiv1.appendChild(imgElement1);


    const chartDiv2 = document.createElement('div');
    chartDiv2.className = 'chart';

    // Create the image element
    const imgElement2 = document.createElement('img');
    imgElement2.src = '曲线图.jpg';
    imgElement2.alt = 'Availability graph';
    imgElement2.style.width = '100%';
    imgElement2.style.height = 'auto';

    // Append the image to the chart container div
    chartDiv2.appendChild(imgElement2);



    detailContainer.appendChild(lotName);
    detailContainer.appendChild(lotDistance);
    detailContainer.appendChild(lotAddress);
    detailContainer.appendChild(lotAvailability);
    detailContainer.appendChild(lotRate);
    detailContainer.appendChild(lotPrice);
    detailContainer.appendChild(lotRisk);
    detailContainer.appendChild(chartDiv1);
    detailContainer.appendChild(chartDiv2);
});

document.addEventListener("DOMContentLoaded", () => {
    console.log(111111111111);

    // loadNewGoogleMapsScript();

    const title = document.getElementById("title");
    title.addEventListener("click", () => {window.location.href = '../main-page/index.html';});

    const update = document.getElementById("update");
    update.addEventListener("click", () => {window.location.href = '../report-page/index.html';});

    const back = document.getElementById("back");
    back.addEventListener("click", () => {window.location.href = '../main-page/index.html';});






});
