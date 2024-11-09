document.addEventListener("DOMContentLoaded", function () {
    const yesTicketInput = document.getElementById("yes-ticket");
    const noTicketInput = document.getElementById("no-ticket");
    const ticketTimeContainer = document.querySelector(".ticket-time-container");

    ticketTimeContainer.style.display = "none";

    const params = new URLSearchParams(window.location.search);
    const place_id = params.get("place_id");
    const name = params.get("name");
    const address = params.get("address")

    console.log(name);
    console.log(address);

    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = '';

    const ratingTextDiv = document.createElement("div");
    ratingTextDiv.className = "rating-text";
    ratingTextDiv.textContent = "I am rating...";
    const nameDiv = document.createElement("div");
    nameDiv.className = "parking-lot-name";
    nameDiv.textContent = name;
    const addressDiv = document.createElement("div");
    addressDiv.className = "address";
    addressDiv.textContent = address;


    detailsContainer.appendChild(ratingTextDiv);
    detailsContainer.appendChild(nameDiv);
    detailsContainer.appendChild(addressDiv);



    function handleTicketChange() {
        if (yesTicketInput.checked) {
            ticketTimeContainer.style.display = "flex";
        } else {
            ticketTimeContainer.style.display = "none";
        }
    }

    yesTicketInput.addEventListener("change", handleTicketChange);
    noTicketInput.addEventListener("change", handleTicketChange);
});

const stars = document.querySelectorAll('#starRating .fa-star');
let ratingValue = 0;

stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    ratingValue = index + 1;
    updateStars(ratingValue);
  });

  star.addEventListener('mouseover', () => {
    updateStars(index + 1);
  });

  star.addEventListener('mouseout', () => {
    updateStars(ratingValue);
  });
});

function updateStars(rating) {
  stars.forEach((star, index) => {
    star.classList.toggle('checked', index < rating);
  });
}

const submitButton = document.querySelector(".submit-button");


submitButton.addEventListener('click', async () => {
    // Gather input values
    const price = document.getElementById('priceInput').value;
    const occupation = document.getElementById('occupationInput').value;
    const ticket = document.querySelector('input[name="ticket"]:checked')?.value;
    const ticketTime = document.getElementById('ticket-time').value;

    // Check if all required fields are available
    if (price === '' || occupation === '' || !ticket) {
        alert("Please fill in all the required fields.");
        return;
    }

    // Constructing the data payload to send
    const formData = {
        rating: ratingValue,
        price: Number(price),
        occupation: Number(occupation),
        ticket: ticket,
        ticketTime: ticket === "yes" ? ticketTime : null
    };

    console.log("Form Data:", formData);

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
            console.log("Success:", result);
            alert("Item added successfully!");
        } else {
            console.error("Failed to submit:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

const back = document.querySelector(".back-button");
back.addEventListener("click", () => {window.location.href = '../detail-page/index.html';});