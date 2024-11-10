// import { initMap } from '../../Back-End/map01/index.js';

// Wait for the document to load fully before executing the code
document.addEventListener("DOMContentLoaded", () => {
    console.log(111111111);
    // initMap();
    // SearchParking(1000);


        // Add an event listener to update the parking list when data is ready
    document.addEventListener("parkingListUpdated",  (event) => {
        console.log('333');
        const parkingListContainer = document.getElementById("parking-list");
        parkingListContainer.innerHTML = ""; // Clear existing content
    
        const parkingList = event.detail;
        let monGoParkingLots = null;
        let index = 1;

        // Create div elements for each parking lot in the returned list
        parkingList.forEach(async (parkingLot) => {
            const parkingDiv = document.createElement("div");
            parkingDiv.classList.add("parking-lot-info");
            // parkingDiv.id = index;
            parkingDiv.addEventListener("click", (event) => {

            const event02 = new CustomEvent('UserClickedOnList');
            document.dispatchEvent(event02);
            console.log("create event");
            console.log(event02);

            if (event.target.closest(".parking-lot-info")) {
                // const boardCastLocation = new URLSearchParams(parkingLot.location);
                const query = `lat=${parkingLot.location.lat}&lng=${parkingLot.location.lng}&name=${parkingLot.name}&id=${parkingLot.place_id}&distance=${Math.round(parkingLot.distance*1000)}&rate=${parkingLot.rating}&address=${parkingLot.address}`;
                window.location.href = `../detail-page/index.html?${query}`;
                console.log("Redirecting to detail page");
            }
            console.log(22222222);
            });

            //get datafrom mongoDB
            try {
                // Fetch data from the backend
                console.log('FROM MAIN PLACE_ID')
                console.log(parkingLot.place_id);
                const response = await fetch(`http://localhost:3000/items?id=${parkingLot.place_id}`, {
                  method: 'GET',
                  headers: {
                      "Content-Type": "application/json"
                  }
                });
                
                  if (response.ok) {
                  monGoParkingLots = await response.json();
                  if (monGoParkingLots.length === 0){
                    monGoParkingLots = [{
                        'location_id': place_id,
                        'rating': null,
                        'price': null,
                        'occupation': [null],
                        'ticket': null
                      }];
                }
                  console.log('FROM MAIN');
                  console.log(monGoParkingLots);
                  } else {
                    console.log("RESPONSE NOT OK")
                //   console.error("Failed to fetch parking lots:", response.statusText);
                    monGoParkingLots = [{
                        'location_id': parkingLot.place_id,
                        'rating': null,
                        'price': null,
                        'occupation': [null],
                        'ticket': null
                      }];
                      console.log(monGoParkingLots);
                  }
              } catch (error) {
                //   console.error("Error fetching parking lot data:", error);
                }

            const lotName = document.createElement('p');
            lotName.textContent = `${index}. ${parkingLot.name}`;
            lotName.classList.add('parking-lot-name');

            const lotDistance = document.createElement('span');

            lotDistance.textContent = `<${Math.round(parkingLot.distance*1000)}m`;
            lotDistance.classList.add('distance');

            const lotInfo = document.createElement('p');
            let occ;
            if(monGoParkingLots[0]['occupation'][0] === null) {
                console.log('null occ')
                occ = "None";
            }
            else {
                occ = monGoParkingLots[0]['occupation'][0] + "%";
            }
            let price;
            if(monGoParkingLots[0]['price'] === null) {
                price = "None";
            }
            else {
                price = monGoParkingLots[0]['price'] + "/hr";
            }
            const infoContent = `Availability: ${occ}    Price: $${price}/hr`;
            lotInfo.textContent = infoContent;
            // lotInfo.classList.add('parking-lot-name');

            parkingDiv.appendChild(lotName);
            parkingDiv.appendChild(lotDistance);
            parkingDiv.appendChild(lotInfo);

            parkingListContainer.appendChild(parkingDiv);
            index++;
        });

        
    });
    
    // const posts = document.querySelector(".parking-lot-info");
    // posts.addEventListener("click", (event) => {
    //     // window.location.href = '../detail-page/index.html';
    // if (event.target.closest(".parking-lot-info")) {
    //     window.location.href = '../detail-page/index.html';
    //     console.log("Redirecting to detail page");
    // }
    // console.log(22222222);
// });

});
// export const returnLocation = boardCastLocation();
// export {returnLocation};