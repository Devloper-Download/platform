document.addEventListener("DOMContentLoaded", () => {
  const themes = document.querySelectorAll(".theme");
  const random = Math.floor(Math.random() * themes.length);
  themes[random].style.display = "flex";
});
