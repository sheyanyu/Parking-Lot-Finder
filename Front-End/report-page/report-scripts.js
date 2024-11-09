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