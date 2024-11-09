document.addEventListener("DOMContentLoaded", function () {
    const yesTicketInput = document.getElementById("yes-ticket");
    const noTicketInput = document.getElementById("no-ticket");
    const ticketTimeContainer = document.querySelector(".ticket-time-container");

    ticketTimeContainer.style.display = "none";


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
    /*
    try {
        // Send the data to your backend
        const response = await fetch('/api/report-parking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log("Data submitted successfully!");
            alert("Thanks for submitting your review!");
            // Reset the input fields after submission
            document.getElementById('priceInput').value = '';
            document.getElementById('occupationInput').value = '';
            yesTicketInput.checked = false;
            noTicketInput.checked = false;
            ticketTimeContainer.style.display = "none";
            updateStars(0); // Reset star rating
        } else {
            console.error("Failed to submit data");
            alert("Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting data:", error);
        alert("An error occurred. Please try again later.");
    } */
});