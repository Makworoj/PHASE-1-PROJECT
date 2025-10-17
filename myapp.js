// Global variables
let facilities = [];
const facilityList = document.getElementById("facility-list");
const searchInput = document.getElementById("search");
const countyFilter = document.getElementById("county-filter");
const typeFilter = document.getElementById("type-filter");
const nhifFilter = document.getElementById("nhif-filter");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// ✅ Fetch data from db.json
fetch("http://localhost:3000/facilities")
  .then((res) => res.json())
  .then((data) => {
    facilities = data;
    displayFacilities(facilities);
  })
  .catch((err) => console.error("Error fetching facilities:", err));

// ✅ Display all facilities
function displayFacilities(facilities) {
  facilityList.innerHTML = "";
  if (facilities.length === 0) {
    facilityList.innerHTML =
      `<p style="text-align:center; font-style:italic;">No facilities found.</p>`;
    return;
  }

  facilities.forEach((facility) => {
    const card = document.createElement("div");
    card.classList.add("facility-card");
    card.innerHTML = `
      <h3>${facility.name}</h3>
      <p><strong>County:</strong> ${facility.location}</p>
      <p><strong>Type:</strong> ${facility.type}</p>
      <p><strong>NHIF Accredited:</strong> ${facility.nhif ? "✅ Yes" : "❌ No"}</p>
      <button class="like-btn" data-id="${facility.id}">❤️ ${facility.likes}</button>
    `;
    facilityList.appendChild(card);
  });

  // ✅ Like functionality
  document.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const facility = facilities.find((f) => f.id == id);
      facility.likes++;
      e.target.textContent = `❤️ ${facility.likes}`;

      // Update the like count in db.json
      fetch(`http://localhost:3000/facilities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: facility.likes }),
      });
    });
  });
}

// ✅ Search & Filter logic
function filterFacilities() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCounty = countyFilter.value.toLowerCase();
  const selectedType = typeFilter.value.toLowerCase();
  const nhifOnly = nhifFilter.checked;

  const filtered = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchTerm) ||
      facility.location.toLowerCase().includes(searchTerm);
    const matchesCounty =
      selectedCounty === "" ||
      facility.location.toLowerCase() === selectedCounty;
    const matchesType =
      selectedType === "" || facility.type.toLowerCase() === selectedType;
    const matchesNHIF = !nhifOnly || facility.nhif === true;

    return matchesSearch && matchesCounty && matchesType && matchesNHIF;
  });

  displayFacilities(filtered);
}

// ✅ Add event listeners
searchInput.addEventListener("input", filterFacilities);
countyFilter.addEventListener("change", filterFacilities);
typeFilter.addEventListener("change", filterFacilities);
nhifFilter.addEventListener("change", filterFacilities);

// ✅ Dark Mode Toggle (fixed)
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const darkModeOn = body.classList.contains("dark-mode");
  themeToggle.textContent = darkModeOn ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("darkMode", darkModeOn ? "enabled" : "disabled");
});

// ✅ Apply saved theme on load
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme === "enabled") {
    body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    themeToggle.textContent = "🌙 Dark Mode";
  }
});
