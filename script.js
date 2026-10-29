
// FLOAT - PHASE 1 JAVASCRIPT PROTOTYPE
// All workspace listings are fictional sample data.

const workspaces = [
  {
    id: 1,
    name: "The Pink Loft",
    location: "Buckhead, Atlanta, GA",
    specialty: ["Makeup", "Hair"],
    price: 250,
    description: "A posh, feminine space filled with natural light and beautiful styling stations.",
    amenities: ["Vanity mirrors", "Styling chairs", "Wi-Fi", "Natural lighting"],
    color: "#f3a9bd"
  },
  {
    id: 2,
    name: "The Blushhaus",
    location: "Downtown Atlanta, GA",
    specialty: ["Makeup", "Lashes"],
    price: 150,
    description: "A soft, sophisticated beauty retreat designed for independent artists.",
    amenities: ["Makeup station", "Ring light", "Client chair", "Wi-Fi"],
    color: "#e9c9d1"
  },
  {
    id: 3,
    name: "Buckhead Glow",
    location: "Buckhead, Atlanta, GA",
    specialty: ["Makeup", "Lashes"],
    price: 100,
    description: "A chic, sunlit studio offering a comfortable and private experience.",
    amenities: ["Vanity", "Treatment bed", "Lighting", "Wi-Fi"],
    color: "#edcba6"
  },
  {
    id: 4,
    name: "Salone",
    location: "Smyrna, GA",
    specialty: ["Hair"],
    price: 150,
    description: "A sleek, modern salon workspace with essential styling equipment.",
    amenities: ["Styling chair", "Mirror", "Shampoo sink", "Wi-Fi"],
    color: "#d5c5b6"
  },
  {
    id: 5,
    name: "The Vanity Room",
    location: "Sandy Springs, GA",
    specialty: ["Makeup", "Nails"],
    price: 215,
    description: "A private luxury workspace for beauty professionals.",
    amenities: ["Vanity", "Workstation", "Client seating", "Wi-Fi"],
    color: "#c8d7ce"
  },
  {
    id: 6,
    name: "Lush Luxe",
    location: "Downtown Atlanta, GA",
    specialty: ["Hair", "Nails"],
    price: 175,
    description: "A bright creative studio for artists who value comfort and style.",
    amenities: ["Styling area", "Worktable", "Mirror", "Wi-Fi"],
    color: "#dbb9c0"
  }
];

const grid = document.getElementById("workspace-grid");
const locationInput = document.getElementById("location");
const specialtyInput = document.getElementById("specialty");
const resultCount = document.getElementById("result-count");
const noResults = document.getElementById("no-results");
const dialog = document.getElementById("booking-dialog");
const bookingContent = document.getElementById("booking-content");

const favorites = new Set();

function renderWorkspaces(list) {
  grid.innerHTML = "";

  resultCount.textContent =
    `${list.length} sample ${list.length === 1 ? "space" : "spaces"}`;

  noResults.hidden = list.length > 0;

  list.forEach((space) => {
    const card = document.createElement("article");
    card.className = "workspace-card";

    card.innerHTML = `
      <div class="workspace-image"
           style="--space-color: ${space.color}">
        <span class="sample-tag">SAMPLE SPACE</span>
        <button
          class="favorite ${favorites.has(space.id) ? "active" : ""}"
          type="button"
          data-favorite="${space.id}"
          aria-label="Toggle favorite for ${space.name}"
          aria-pressed="${favorites.has(space.id)}"
        >
          ${favorites.has(space.id) ? "♥" : "♡"}
        </button>
      </div>

      <div class="workspace-info">
        <span class="location-text">${space.location}</span>
        <h4>${space.name}</h4>
        <p>${space.description}</p>

        <div class="card-bottom">
          <div class="price">
            $${space.price}<small>/Day</small>
          </div>

          <button class="view-button" type="button"
                  data-view="${space.id}">
            View Space
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function searchWorkspaces() {
  const location = locationInput.value.trim().toLowerCase();
  const specialty = specialtyInput.value;

  const filtered = workspaces.filter((space) => {
    const matchesLocation =
      space.location.toLowerCase().includes(location);

    const matchesSpecialty =
      specialty === "all" ||
      space.specialty.includes(specialty);

    return matchesLocation && matchesSpecialty;
  });

  renderWorkspaces(filtered);
}

document.getElementById("search-button")
  .addEventListener("click", searchWorkspaces);

locationInput.addEventListener("input", searchWorkspaces);
specialtyInput.addEventListener("change", searchWorkspaces);

grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);

    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    searchWorkspaces();
    return;
  }

  const viewButton = event.target.closest("[data-view]");

  if (viewButton) {
    openWorkspace(Number(viewButton.dataset.view));
  }
});

function openWorkspace(id) {
  const space = workspaces.find((item) => item.id === id);
  if (!space) return;

  bookingContent.innerHTML = `
    <span class="eyebrow">FLOAT WORKSPACE</span>
    <h2 class="dialog-title" id="dialog-title">${space.name}</h2>
    <div class="dialog-price">$${space.price} / Day</div>

    <p class="dialog-description">${space.description}</p>
    <p><strong>Location:</strong> ${space.location}</p>

    <h3>Included Amenities</h3>
    <div class="amenities">
      ${space.amenities.map((item) => `<span>${item}</span>`).join("")}
    </div>

    <h3>Choose Your Date</h3>

    <form id="booking-form" class="booking-form">
      <label for="booking-date">Rental date</label>
      <input id="booking-date" type="date" required>

      <button class="reserve-button" type="submit">
        Reserve Now
      </button>
    </form>

    <p class="booking-note">
      Demo only: This action simulates a reservation.
      No real workspace is booked and no payment is collected.
    </p>
  `;

  const dateInput = document.getElementById("booking-date");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${year}-${month}-${day}`;

  document.getElementById("booking-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      if (!dateInput.value) return;

      // Check date against the browser's local calendar.
      if (dateInput.value < dateInput.min) {
        dateInput.setCustomValidity("Choose today or a future date.");
        dateInput.reportValidity();
        return;
      }

      showConfirmation(space, dateInput.value);
    });

  dialog.showModal();
}

function showConfirmation(space, date) {
  const readableDate = new Date(`${date}T12:00:00`)
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

  bookingContent.innerHTML = `
    <div class="confirmation">
      <div class="confirmation-icon">✓</div>
      <h2 id="dialog-title">Booking Preview Complete!</h2>
      <p>You selected <strong>${space.name}</strong>.</p>
      <p><strong>Date:</strong> ${readableDate}</p>
      <p><strong>Sample daily rate:</strong> $${space.price}</p>
      <p class="booking-note">
        This is a prototype confirmation only.
        No actual reservation or payment was made.
      </p>
      <button class="reserve-button" type="button"
        id="finish-booking">Done</button>
    </div>
  `;

  document.getElementById("finish-booking")
    .addEventListener("click", () => dialog.close());
}

document.getElementById("close-dialog")
  .addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

// Display all sample workspaces when the page loads.
renderWorkspaces(workspaces);
