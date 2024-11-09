// import {loadNewGoogleMapsScript} from "../../Back-End/map01/index2.js";

//Access parking lot data from two database.
try {
    // Send data to the backend
    const response = await fetch("http://localhost:3000/submit", {
        method: 'get',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Item added successfully!");
    } else {
        console.error("Failed to submit:", response.statusText);
    }
} catch (error) {
    console.error("Error:", error);
}




document.addEventListener("DOMContentLoaded", () => {
    console.log(111111111111);

    // loadNewGoogleMapsScript();

    const title = document.getElementById("title");
    title.addEventListener("click", () => {window.location.href = '../main-page/index.html';});

    const update = document.getElementById("update");
    update.addEventListener("click", () => {window.location.href = '../report-page/index.html';});

    const back = document.getElementById("back");
    back.addEventListener("click", () => {window.location.href = '../main-page/index.html';});






//Creating Parking Lot detail block
    const detailContainer = document.querySelector(".parking-card");

    const lotName = document.createElement('h1');
    const parkingLotName = "Parking Lot Example"
    lotName.textContent = parkingLotName;
    // lotName.classList.add('parking-lot-name');

    const lotDistance = document.createElement('p');
    const distanceContent = 180;
    lotDistance.textContent = `<${distanceContent}m`;
    lotDistance.classList.add('distance');

    const lotAddress = document.createElement('p');
    const parkingLotAddress = "9 Flintlock Ln, Amherst, MA 01002";
    lotAddress.textContent = parkingLotAddress;
    // lotInfo.classList.add('parking-lot-name');


    const lotAvailability = document.createElement('p');
    const availabilityPersent = 20;
    const parkingLotAvailability = `Availability: ${availabilityPersent}%`;
    lotAvailability.textContent = parkingLotAvailability;
    // lotInfo.classList.add('parking-lot-name');

    const lotRate = document.createElement('p');

        const starSpan = document.createElement('span');
        const Rate = 3;
        for (let i = Rate; i>0; i--) {
            starSpan.innerHTML += "⭐";
        }
    
    lotRate.textContent = "Rate: ";
    lotRate.appendChild(starSpan);
    // lotInfo.classList.add('parking-lot-name');




    const lotPrice = document.createElement('p');
    const price = 25;
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
    // detailContainer
    // <h1>1. Parking lot A</h1>
    // <p class="distance">&lt;34m</p>
    // <p>Address: 9 Flintlock Ln, Amherst, MA 01002</p>
    // <p>Availability: 20%</p>
    // <p>Google Rate: <span class="rating">⭐⭐⭐</span></p>
    // <p>Price: $25/hour &nbsp;&nbsp;&nbsp; $100/Day</p>
    // <p>Risk: Low</p>

    // <div class="chart">
    //     <img src="曲线图.jpg" alt="Availability graph" style="width: 100%; height: auto;">
    // </div>
    // <div class="chart">
    //   <img src="曲线图.jpg" alt="Availability graph" style="width: 100%; height: auto;">
    // </div>

});
