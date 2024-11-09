document.addEventListener("DOMContentLoaded", () => {
    console.log(111111111111);
    const title = document.getElementById("title");
    title.addEventListener("click", () => {window.location.href = '../main-page/index.html';});

    const update = document.getElementById("update");
    update.addEventListener("click", () => {window.location.href = '../report-page/index.html';});

    
});
