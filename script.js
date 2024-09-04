const username = document.getElementById("userName");
const userJob = document.getElementById("userJob");
const editProfileBtn = document.getElementById("editProfileBtn");
const popup = document.getElementById("popup");
const profilePopup = document.getElementById("editProfile");
const nameInput = document.getElementById("inputName");
const jobInput = document.getElementById("inputJob");

// Load Profile
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (profile) {
    username.textContent = profile.name;
    userJob.textContent = profile.job || "--";
    nameInput.value = profile.name;
    jobInput.value = profile.job;
    popup.classList.add("hidden");
    profilePopup.classList.add("hidden");
  } else {
    popup.classList.remove("hidden");
    profilePopup.classList.remove("hidden");
  }
}

// Save Profile
saveProfileBtn.addEventListener("click", function () {
  const name = nameInput.value;
  const job = jobInput.value;
  if (!name) {
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    alert("name can't be empty!");
    nameInput.value = savedProfile.name;
  } else {
    const profile = {
      name: name,
      job: job,
    };
    localStorage.setItem("profile", JSON.stringify(profile));
    loadProfile();
  }
});

// Edit Profile
editProfileBtn.addEventListener("click", function () {
  popup.classList.remove("hidden");
  profilePopup.classList.remove("hidden");
});

// Update Time and Date
function updateTime() {
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const dateString = `${day} ${fullMonths[month]} ${year}`;
  const timeString = `${hours}:${minutes}:${seconds}`;

  document.getElementById("clock").textContent = timeString;
  document.getElementById("date").textContent = dateString;
}

loadProfile();
updateTime();
setInterval(updateTime, 1000);
