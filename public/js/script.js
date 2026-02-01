document.addEventListener("DOMContentLoaded", function() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.querySelector("nav ul");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      hamburgerBtn.classList.toggle("open");
    });
  }
});