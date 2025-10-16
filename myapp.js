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
// ========== RENDER FUNCTION ==========
function renderFacilities(data) {
  facilityList.innerHTML = "";

  if (data.length === 0) {
    facilityList.innerHTML = `<p class="no-results">No facilities found.</p>`;
    return;
  }

  data.forEach(facility => {
    const card = document.createElement("div");
    card.classList.add("facility-card");

    card.innerHTML = `
      <h3>${facility.name}</h3>
      <p><strong>County:</strong> ${facility.county}</p>
      <p><strong>Type:</strong> ${facility.facility_type}</p>
      <p><strong>NHIF Accredited:</strong> ${facility.nhif ? "✅ Yes" : "❌ No"}</p>
      <button class="like-btn" data-id="${facility.id}">
        ❤️ ${facility.likes}
      </button>
    `;

    facilityList.appendChild(card);
  });
}// ========== EVENT LISTENERS ==========

// 1️⃣ Search input
searchInput.addEventListener("input", () => applyFilters());

// 2️⃣ Dropdown filters
countyFilter.addEventListener("change", () => applyFilters());
typeFilter.addEventListener("change", () => applyFilters());
nhifFilter.addEventListener("change", () => applyFilters());

// 3️⃣ Like button (event delegation)
facilityList.addEventListener("click", (e) => {
  if (e.target.classList.contains("like-btn")) {
    const id = e.target.dataset.id;
    const facility = facilities.find(f => f.id == id);
    if (facility) {
      const updatedLikes = facility.likes + 1;
      updateLikes(id, updatedLikes, e.target);
    }
  }
});

// 4️⃣ Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkModeOn = document.body.classList.contains("dark");
  themeToggle.textContent = darkModeOn ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// ========== UPDATE LIKES ==========
function updateLikes(id, newLikes, buttonEl) {
  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updated => {
      buttonEl.textContent = `❤️ ${updated.likes}`;
      const index = facilities.findIndex(f => f.id == id);
      if (index !== -1) facilities[index] = updated;
    })
    .catch(err => console.error("Error updating likes:", err));
}

// ========== FILTER FUNCTION ==========
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const county = countyFilter.value;
  const type = typeFilter.value;
  const nhifOnly = nhifFilter.checked;

  const filtered = facilities.filter(facility => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchTerm) ||
      facility.county.toLowerCase().includes(searchTerm);

    const matchesCounty = county ? facility.county === county : true;
    const matchesType = type ? facility.facility_type === type : true;
    const matchesNHIF = nhifOnly ? facility.nhif : true;

    return matchesSearch && matchesCounty && matchesType && matchesNHIF;
  });

  renderFacilities(filtered);
}


fetchFacilities();
