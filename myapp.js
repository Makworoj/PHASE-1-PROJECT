const facilityList = document.getElementById("facility-list");
const searchInput = document.getElementById("search");
const countyFilter = document.getElementById("county-filter");
const typeFilter = document.getElementById("type-filter");
const nhifFilter = document.getElementById("nhif-filter");
const themeToggle = document.getElementById("theme-toggle");

const API_URL = "http://localhost:3000/facilities";
let facilities = [];

// ========== FETCH DATA ==========
function fetchFacilities() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      facilities = data;
      renderFacilities(facilities);
    })
    .catch(err => console.error("Error fetching facilities:", err));
}
