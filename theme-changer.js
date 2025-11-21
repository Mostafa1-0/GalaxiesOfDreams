const toggleLabel = document.getElementById("theme-toggle");
const checkbox = toggleLabel.querySelector(".input");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
    checkbox.checked = true;
}

checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
    }
});
// Hamburger menu toggle
// Mobile nav toggle


