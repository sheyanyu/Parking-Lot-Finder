let parking_list;
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('parkingListUpdated', (event) =>{
        const parkingListContainer = document.getElementById("parking-list");
        parkingListContainer.innerHTML = ""; 
        parking_list = event.detail;
        async function update(formData){
            try {
                // Send data to the backend
                const response = await fetch("http://localhost:3000/submit", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
        
                if (response.ok) {
                    const result = await response.json();
                    // console.log("Success:", result);
                    // alert("Item added successfully!");
                } else {
                    console.error("Failed to submit:", response.statusText);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    
        parking_list.forEach((parking_lot) =>{
            const rand_rating = Math.floor(Math.random() * 6);
            const rand_price = Math.floor(Math.random() * 50);
            const rand_occu = Math.floor(Math.random() * 100);
            const formData = {
                location_id: parking_lot.place_id,
                rating: rand_rating,
                price: rand_price,
                occupation: rand_occu,
                ticket: null,
                ticketTime: null
            };
            for(let i = 0; i < 5; i++){
                update(formData);
            }
            console.log('updated formData')
            console.log(formData);
        })
    });
});