/**
 * Infyn Movies Admin Panel — Frontend Logic
 * Full CRUD, Episode Builder, Search & Live Firestore Sync
 */

// State
let allMovies = [];
let editingSlug = null;
let deletingSlug = null;
let adminKey = localStorage.getItem("infyn_admin_key") || "admin123";

// DOM Elements
const statusPill = document.getElementById("connection-status");
const statTotalMovies = document.getElementById("stat-total-movies");
const statTotalEpisodes = document.getElementById("stat-total-episodes");
const statFeaturedTitle = document.getElementById("stat-featured-title");
const moviesContainer = document.getElementById("movies-container");
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const genreFilter = document.getElementById("genre-filter");
const btnRefresh = document.getElementById("btn-refresh");

// Modals
const movieModal = document.getElementById("movie-modal");
const modalTitle = document.getElementById("modal-title");
const modalClose = document.getElementById("modal-close");
const btnModalCancel = document.getElementById("btn-modal-cancel");
const movieForm = document.getElementById("movie-form");
const btnModalSave = document.getElementById("btn-modal-save");
const btnAddMovie = document.getElementById("btn-add-movie");
const btnGenSlug = document.getElementById("btn-gen-slug");

// Episodes
const btnAddEpisode = document.getElementById("btn-add-episode");
const episodesContainer = document.getElementById("episodes-container");

// Admin Key Modal
const keyModal = document.getElementById("key-modal");
const btnAdminKey = document.getElementById("btn-admin-key");
const keyModalClose = document.getElementById("key-modal-close");
const btnSaveKey = document.getElementById("btn-save-key");
const fAdminKey = document.getElementById("f-admin-key");
const keyStatusLabel = document.getElementById("key-status-label");

// Delete Modal
const deleteModal = document.getElementById("delete-modal");
const deleteModalClose = document.getElementById("delete-modal-close");
const btnCancelDelete = document.getElementById("btn-cancel-delete");
const btnConfirmDelete = document.getElementById("btn-confirm-delete");
const deleteMovieName = document.getElementById("delete-movie-name");

// Toast
const toastContainer = document.getElementById("toast-container");

// ----------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  fAdminKey.value = adminKey;
  updateKeyLabel();
  checkConnectionStatus();
  fetchMovies();
  setupEventListeners();
});

function updateKeyLabel() {
  keyStatusLabel.textContent = adminKey ? "Key Configured" : "Set Admin Key";
}

// ----------------------------------------------------
// EVENT LISTENERS
// ----------------------------------------------------

function setupEventListeners() {
  // Search & Filter
  searchInput.addEventListener("input", () => {
    searchClear.style.display = searchInput.value ? "block" : "none";
    renderMovies();
  });

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchClear.style.display = "none";
    renderMovies();
  });

  genreFilter.addEventListener("change", renderMovies);
  btnRefresh.addEventListener("click", fetchMovies);

  // Movie Modal
  btnAddMovie.addEventListener("click", () => openMovieModal());
  modalClose.addEventListener("click", closeMovieModal);
  btnModalCancel.addEventListener("click", closeMovieModal);
  movieForm.addEventListener("submit", handleMovieSubmit);

  // Auto-generate slug
  btnGenSlug.addEventListener("click", () => {
    const titleVal = document.getElementById("f-title").value;
    if (titleVal) {
      document.getElementById("f-slug").value = slugify(titleVal);
    }
  });

  document.getElementById("f-title").addEventListener("blur", () => {
    const slugInput = document.getElementById("f-slug");
    if (!slugInput.value && document.getElementById("f-title").value) {
      slugInput.value = slugify(document.getElementById("f-title").value);
    }
  });

  // Episode Add
  btnAddEpisode.addEventListener("click", () => {
    const epNum = episodesContainer.children.length + 1;
    addEpisodeRow({
      episodeNumber: epNum,
      title: `Episode ${epNum}`,
      duration: "40 min",
      size: "750 MB",
      downloadUrl: "",
      synopsis: "",
    });
  });

  // Admin Key Modal
  btnAdminKey.addEventListener("click", () => {
    fAdminKey.value = adminKey;
    keyModal.style.display = "flex";
  });
  keyModalClose.addEventListener("click", () => (keyModal.style.display = "none"));
  btnSaveKey.addEventListener("click", () => {
    adminKey = fAdminKey.value.trim();
    localStorage.setItem("infyn_admin_key", adminKey);
    keyModal.style.display = "none";
    updateKeyLabel();
    showToast("Admin Key saved successfully!", "success");
  });

  // Delete Modal
  deleteModalClose.addEventListener("click", () => (deleteModal.style.display = "none"));
  btnCancelDelete.addEventListener("click", () => (deleteModal.style.display = "none"));
  btnConfirmDelete.addEventListener("click", confirmDeleteMovie);
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ----------------------------------------------------
// API CALLS
// ----------------------------------------------------

async function checkConnectionStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();

    if (data.firebaseConnected) {
      statusPill.className = "status-pill status-connected";
      statusPill.querySelector(".status-text").textContent = "Firestore Live";
    } else {
      statusPill.className = "status-pill status-error";
      statusPill.querySelector(".status-text").textContent = "Firestore Offline";
      showToast("Firebase Admin offline: " + (data.error || "Check serviceAccountKey"), "error");
    }
  } catch (err) {
    statusPill.className = "status-pill status-error";
    statusPill.querySelector(".status-text").textContent = "Server Offline";
  }
}

async function fetchMovies() {
  try {
    const res = await fetch("/api/movies");
    const data = await res.json();

    if (data.success) {
      allMovies = data.movies;
      updateStats();
      updateGenreFilter();
      renderMovies();
    } else {
      showToast("Error loading movies: " + data.error, "error");
    }
  } catch (err) {
    console.error("Fetch movies error:", err);
    showToast("Network error connecting to backend.", "error");
  }
}

// ----------------------------------------------------
// STATS & FILTERS
// ----------------------------------------------------

function updateStats() {
  statTotalMovies.textContent = allMovies.length;

  let totalEp = 0;
  let featured = null;

  allMovies.forEach((m) => {
    if (Array.isArray(m.episodes)) {
      totalEp += m.episodes.length;
    }
    if (m.featured && !featured) {
      featured = m.title;
    }
  });

  statTotalEpisodes.textContent = totalEp;
  statFeaturedTitle.textContent = featured || (allMovies[0] ? allMovies[0].title : "None");
}

function updateGenreFilter() {
  const genresSet = new Set();
  allMovies.forEach((m) => {
    if (Array.isArray(m.genres)) {
      m.genres.forEach((g) => genresSet.add(g));
    }
  });

  const currentVal = genreFilter.value;
  genreFilter.innerHTML = `<option value="ALL">All Genres (${allMovies.length})</option>`;

  Array.from(genresSet).sort().forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    genreFilter.appendChild(opt);
  });

  if (Array.from(genresSet).includes(currentVal)) {
    genreFilter.value = currentVal;
  }
}

// ----------------------------------------------------
// RENDER MOVIES
// ----------------------------------------------------

function renderMovies() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;

  const filtered = allMovies.filter((movie) => {
    const matchesGenre =
      selectedGenre === "ALL" ||
      (Array.isArray(movie.genres) && movie.genres.includes(selectedGenre));

    if (!matchesGenre) return false;
    if (!query) return true;

    const titleMatch = movie.title?.toLowerCase().includes(query);
    const slugMatch = movie.slug?.toLowerCase().includes(query);
    const directorMatch = movie.director?.toLowerCase().includes(query);
    const castMatch =
      Array.isArray(movie.cast) &&
      movie.cast.some((c) => c.toLowerCase().includes(query));

    return titleMatch || slugMatch || directorMatch || castMatch;
  });

  if (filtered.length === 0) {
    moviesContainer.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>No titles found</h3>
        <p class="text-muted">Try adjusting your search query or click "Add New Movie" above.</p>
      </div>
    `;
    return;
  }

  moviesContainer.innerHTML = filtered
    .map((movie) => {
      const epCount = Array.isArray(movie.episodes) ? movie.episodes.length : 0;
      const posterSrc = movie.poster || "/movieData/default-poster.jpg";

      return `
      <div class="movie-card" data-slug="${movie.slug}">
        <div class="card-top">
          <img
            src="${posterSrc}"
            alt="${movie.title}"
            class="card-poster"
            onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'"
          />
          <div class="card-badges">
            ${movie.featured ? '<span class="badge badge-featured">Featured</span>' : ""}
            <span class="badge badge-quality">${movie.quality || "1080p"}</span>
            <span class="badge">${movie.contentRating || "U/A 16+"}</span>
          </div>
          <div class="card-rating-pill">
            ★ <span>${movie.rating || "8.0"}</span>
          </div>
        </div>

        <div class="card-content">
          <h3 class="card-title">${movie.title}</h3>
          
          <div class="card-meta">
            <span>${movie.year || "2026"}</span>
            <span>•</span>
            <span>${movie.duration || "1 Season"}</span>
            <span>•</span>
            <span>${Array.isArray(movie.genres) ? movie.genres.slice(0, 2).join(", ") : ""}</span>
          </div>

          <p class="card-synopsis">${movie.synopsis || movie.tagline || "No synopsis available."}</p>

          <div class="card-stats">
            <span>📺 <strong>${epCount}</strong> Episodes</span>
            <span>💾 <strong>${movie.seasonSize || "Direct Drive"}</strong></span>
          </div>

          <div class="card-actions">
            <button class="btn btn-secondary btn-sm" onclick="editMovie('${movie.slug}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Edit</span>
            </button>

            <button class="btn btn-danger btn-sm" onclick="openDeleteModal('${movie.slug}', '${escapeHtml(movie.title)}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// ----------------------------------------------------
// EPISODE MANAGER
// ----------------------------------------------------

function addEpisodeRow(ep = {}) {
  const div = document.createElement("div");
  div.className = "episode-item";

  div.innerHTML = `
    <div class="episode-top-bar">
      <span>Episode #<input type="number" class="ep-num" value="${ep.episodeNumber || 1}" style="width: 50px; padding: 2px 4px; display: inline-block;" /></span>
      <button type="button" class="btn-remove-ep" onclick="this.closest('.episode-item').remove()">Remove</button>
    </div>

    <div class="form-grid-2">
      <div class="form-group">
        <label>Episode Title</label>
        <input type="text" class="ep-title" value="${ep.title || ""}" placeholder="e.g. Confirmed Ya RAC" />
      </div>
      <div class="form-group">
        <label>Google Drive Direct Download Link</label>
        <input type="url" class="ep-downloadUrl" value="${ep.downloadUrl || ""}" placeholder="https://drive.google.com/file/d/.../view" />
      </div>
    </div>

    <div class="form-grid-2">
      <div class="form-group">
        <label>Duration</label>
        <input type="text" class="ep-duration" value="${ep.duration || "40 min"}" placeholder="e.g. 41 min" />
      </div>
      <div class="form-group">
        <label>File Size</label>
        <input type="text" class="ep-size" value="${ep.size || "750 MB"}" placeholder="e.g. 774 MB" />
      </div>
    </div>

    <div class="form-group">
      <label>Synopsis (Optional)</label>
      <input type="text" class="ep-synopsis" value="${ep.synopsis || ""}" placeholder="Brief storyline snippet..." />
    </div>
  `;

  episodesContainer.appendChild(div);
}

function getEpisodesFromDOM() {
  const rows = episodesContainer.querySelectorAll(".episode-item");
  const episodes = [];

  rows.forEach((row) => {
    const num = Number(row.querySelector(".ep-num")?.value) || 1;
    const title = row.querySelector(".ep-title")?.value || `Episode ${num}`;
    const downloadUrl = row.querySelector(".ep-downloadUrl")?.value || "";
    const duration = row.querySelector(".ep-duration")?.value || "40 min";
    const size = row.querySelector(".ep-size")?.value || "750 MB";
    const synopsis = row.querySelector(".ep-synopsis")?.value || "";

    episodes.push({
      episodeNumber: num,
      title,
      duration,
      size,
      downloadUrl,
      synopsis,
    });
  });

  return episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
}

// ----------------------------------------------------
// CREATE / EDIT MODAL
// ----------------------------------------------------

function openMovieModal(movie = null) {
  movieForm.reset();
  episodesContainer.innerHTML = "";
  editingSlug = null;

  if (movie) {
    editingSlug = movie.slug;
    modalTitle.textContent = `Edit Title: ${movie.title}`;
    document.getElementById("f-slug").disabled = true; // Slug is document ID

    document.getElementById("f-title").value = movie.title || "";
    document.getElementById("f-slug").value = movie.slug || "";
    document.getElementById("f-tagline").value = movie.tagline || "";
    document.getElementById("f-year").value = movie.year || 2026;
    document.getElementById("f-releaseDate").value = movie.releaseDate || "";
    document.getElementById("f-rating").value = movie.rating || 8.0;
    document.getElementById("f-votes").value = movie.votes || "";
    document.getElementById("f-contentRating").value = movie.contentRating || "U/A 16+";
    document.getElementById("f-duration").value = movie.duration || "";

    document.getElementById("f-poster").value = movie.poster || "";
    document.getElementById("f-trailer").value = movie.localTrailerUrl || "";
    document.getElementById("f-quality").value = movie.quality || "1080p FHD";
    document.getElementById("f-language").value = movie.language || "Hindi (Original 5.1)";

    document.getElementById("f-director").value = movie.director || "";
    document.getElementById("f-genres").value = Array.isArray(movie.genres) ? movie.genres.join(", ") : "";
    document.getElementById("f-cast").value = Array.isArray(movie.cast) ? movie.cast.join(", ") : "";
    document.getElementById("f-synopsis").value = movie.synopsis || "";

    document.getElementById("f-seasonDownloadUrl").value = movie.seasonDownloadUrl || "";
    document.getElementById("f-seasonSize").value = movie.seasonSize || "";
    document.getElementById("f-featured").checked = Boolean(movie.featured);

    if (Array.isArray(movie.episodes)) {
      movie.episodes.forEach((ep) => addEpisodeRow(ep));
    }
  } else {
    modalTitle.textContent = "Add New Movie / Series";
    document.getElementById("f-slug").disabled = false;
    document.getElementById("f-year").value = new Date().getFullYear();
    document.getElementById("f-releaseDate").value = new Date().toISOString().split("T")[0];
  }

  movieModal.style.display = "flex";
}

function closeMovieModal() {
  movieModal.style.display = "none";
}

window.editMovie = function (slug) {
  const movie = allMovies.find((m) => m.slug === slug);
  if (movie) {
    openMovieModal(movie);
  }
};

// ----------------------------------------------------
// SUBMIT MOVIE (POST / PUT)
// ----------------------------------------------------

async function handleMovieSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("f-title").value.trim();
  const slug = document.getElementById("f-slug").value.trim() || slugify(title);

  if (!title || !slug) {
    showToast("Title and URL Slug are required!", "error");
    return;
  }

  const payload = {
    title,
    slug,
    tagline: document.getElementById("f-tagline").value.trim(),
    year: Number(document.getElementById("f-year").value) || new Date().getFullYear(),
    releaseDate: document.getElementById("f-releaseDate").value,
    rating: Number(document.getElementById("f-rating").value) || 8.0,
    votes: document.getElementById("f-votes").value.trim(),
    contentRating: document.getElementById("f-contentRating").value.trim(),
    duration: document.getElementById("f-duration").value.trim(),
    poster: document.getElementById("f-poster").value.trim(),
    localTrailerUrl: document.getElementById("f-trailer").value.trim(),
    quality: document.getElementById("f-quality").value.trim(),
    language: document.getElementById("f-language").value.trim(),
    director: document.getElementById("f-director").value.trim(),
    genres: document.getElementById("f-genres").value,
    cast: document.getElementById("f-cast").value,
    synopsis: document.getElementById("f-synopsis").value.trim(),
    seasonDownloadUrl: document.getElementById("f-seasonDownloadUrl").value.trim(),
    seasonSize: document.getElementById("f-seasonSize").value.trim(),
    featured: document.getElementById("f-featured").checked,
    episodes: getEpisodesFromDOM(),
  };

  btnModalSave.disabled = true;
  btnModalSave.querySelector(".btn-text").textContent = "Saving to Firestore...";
  btnModalSave.querySelector(".btn-spinner").style.display = "inline-block";

  try {
    const url = editingSlug ? `/api/movies/${editingSlug}` : "/api/movies";
    const method = editingSlug ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      showToast(
        editingSlug ? "Movie updated in Firestore!" : "New title added to Firestore!",
        "success"
      );
      closeMovieModal();
      fetchMovies();
    } else {
      showToast(data.error || "Failed to save movie.", "error");
      if (res.status === 401) {
        keyModal.style.display = "flex";
      }
    }
  } catch (err) {
    console.error("Save error:", err);
    showToast("Network error while saving.", "error");
  } finally {
    btnModalSave.disabled = false;
    btnModalSave.querySelector(".btn-text").textContent = "Save to Firestore";
    btnModalSave.querySelector(".btn-spinner").style.display = "none";
  }
}

// ----------------------------------------------------
// DELETE MOVIE
// ----------------------------------------------------

window.openDeleteModal = function (slug, title) {
  deletingSlug = slug;
  deleteMovieName.textContent = title || slug;
  deleteModal.style.display = "flex";
};

async function confirmDeleteMovie() {
  if (!deletingSlug) return;

  btnConfirmDelete.disabled = true;
  btnConfirmDelete.textContent = "Deleting...";

  try {
    const res = await fetch(`/api/movies/${deletingSlug}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": adminKey,
      },
    });

    const data = await res.json();

    if (data.success) {
      showToast("Movie deleted from Firestore.", "success");
      deleteModal.style.display = "none";
      fetchMovies();
    } else {
      showToast(data.error || "Failed to delete movie.", "error");
      if (res.status === 401) {
        keyModal.style.display = "flex";
      }
    }
  } catch (err) {
    showToast("Network error during delete.", "error");
  } finally {
    btnConfirmDelete.disabled = false;
    btnConfirmDelete.textContent = "Delete Permanently";
    deletingSlug = null;
  }
}

// ----------------------------------------------------
// TOAST NOTIFICATIONS
// ----------------------------------------------------

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
