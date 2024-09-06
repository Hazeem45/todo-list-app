const username = document.getElementById("userName");
const userJob = document.getElementById("userJob");
const editProfileBtn = document.getElementById("editProfileBtn");
const popup = document.getElementById("popup");
const profilePopup = document.getElementById("editProfile");
const nameInput = document.getElementById("inputName");
const jobInput = document.getElementById("inputJob");
const addTaskButton = document.getElementById("addTaskBtn");
const hideTaskButton = document.getElementById("hideTaskBtn");
const formTask = document.getElementById("formTask");
const submitTaskBtn = document.getElementById("submitTaskBtn");
const taskText = document.getElementById("taskText");
const priorityLevel = document.getElementById("priorityLevel");
const taskDate = document.getElementById("taskDate");
const ongoingContainer = document.querySelector(".container-tasks");
const completedContainer = document.querySelectorAll(".container-tasks")[1];
const overdueContainer = document.querySelectorAll(".container-tasks")[2];
const confirmAction = document.getElementById("confirmAction");
const confirmBtn = document.getElementById("confirmBtn");

// Format Date DAY MONTH YEAR
function formatDate(datestring) {
  const date = new Date(datestring);
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${fullMonths[month]} ${year}`;
}

// Load Profile
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (profile) {
    username.textContent = profile.name;
    userJob.textContent = profile.job || "--";
    nameInput.value = profile.name;
    jobInput.value = profile.job;
    profilePopup.classList.add("hidden");
    enableScroll();
  } else {
    popup.classList.remove("hidden");
    profilePopup.classList.remove("hidden");
    disableScroll();
  }
}

// Save Profile
saveProfileBtn.addEventListener("click", function () {
  const name = nameInput.value;
  const job = jobInput.value;
  if (!name) {
    document.querySelectorAll(".error-message")[1].classList.remove("hidden");
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile) {
      nameInput.value = savedProfile.name;
    }
  } else {
    const profile = {
      name: name,
      job: job,
    };
    localStorage.setItem("profile", JSON.stringify(profile));
    popup.classList.add("hidden");
    document.querySelectorAll(".error-message")[1].classList.add("hidden");
    loadProfile();
    enableScroll();
  }
});

// Edit Profile
editProfileBtn.addEventListener("click", function () {
  popup.classList.remove("hidden");
  profilePopup.classList.remove("hidden");
  disableScroll();
});

// Update Time and Date
function updateTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const dateString = formatDate(date);
  const timeString = `${hours}:${minutes}:${seconds}`;

  document.getElementById("clock").textContent = timeString;
  document.getElementById("date").textContent = dateString;
}

// Show task form
function expandForm() {
  formTask.classList.add("expand");
  addTaskButton.style.display = "none";
  hideTaskButton.style.display = "flex";
  formTask.style.maxHeight = formTask.scrollHeight + "px";
  document.getElementById("titleForm").style.opacity = 1;
}

// Hide task form
function hideForm() {
  formTask.classList.remove("expand");
  addTaskButton.style.display = "flex";
  hideTaskButton.style.display = "none";
  formTask.style.maxHeight = "70px";
  document.getElementById("titleForm").style.opacity = 0;
  document.querySelectorAll(".error-message")[0].classList.add("hidden");

  // reset form value
  taskText.value = "";
  priorityLevel.value = "";
  taskDate.value = "";
}

// Create new task
submitTaskBtn.addEventListener("click", function () {
  const taskTitle = taskText.value;
  const priority = priorityLevel.value;
  const deadline = taskDate.value;
  const date = new Date();

  if (taskTitle && priority && deadline) {
    const task = {
      taskTitle: taskTitle,
      priority: priority,
      deadline: `${formatDate(deadline)}`,
      added: formatDate(date),
      completed: false,
    };
    saveTask(task);
    displayTasks();
    document.querySelectorAll(".error-message")[0].classList.add("hidden");
  } else {
    document.querySelectorAll(".error-message")[0].classList.remove("hidden");
  }
});

// Save task to local storage
function saveTask(task) {
  let tasks = localStorage.getItem("tasks");
  tasks = tasks ? JSON.parse(tasks) : [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Separate Task Content views based on task status
function displayTasks() {
  const today = new Date();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Clear previous displayed tasks
  ongoingContainer.innerHTML = "";
  completedContainer.innerHTML = "";
  overdueContainer.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskElement = createTaskElement(task, index);

    if (task.completed) {
      completedContainer.appendChild(taskElement);
    } else {
      const taskDeadline = new Date(task.deadline);
      // set the deadline at 11:30pm on that day
      taskDeadline.setHours(23, 30, 0, 0);

      if (taskDeadline < today) {
        overdueContainer.appendChild(taskElement);
        const titleText = document.querySelectorAll(".title-text");
        const deadline = document.querySelectorAll(".deadline-date");

        titleText.forEach((item) => {
          item.style.color = item.parentElement.parentElement.parentElement === overdueContainer ? "rgba(244, 64, 52, 0.9)" : "black";
        });

        deadline.forEach((item) => {
          item.style.color = item.parentElement.parentElement.parentElement.parentElement === overdueContainer ? "red" : "black";
        });
      } else {
        ongoingContainer.appendChild(taskElement);
      }
    }
  });

  // Task information
  createAndAppendInfoContainer(ongoingContainer, "You don't have any active tasks, click Add Task button to create new task");
  createAndAppendInfoContainer(completedContainer, "You have not completed any tasks");
  createAndAppendInfoContainer(overdueContainer, "You don't have any overdue tasks");
}

// to Create description if container doesnt have any child(tasks)
function createAndAppendInfoContainer(container, message) {
  if (container.children.length < 1) {
    const infoElement = document.createElement("h4");
    infoElement.style.textAlign = "center";
    infoElement.innerText = message;
    container.appendChild(infoElement);
  }
}

// Create Task Content
function createTaskElement(task, index) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");

  const taskTitleDiv = document.createElement("div");
  taskTitleDiv.classList.add("task-title");

  const checkboxBtnDiv = document.createElement("div");
  checkboxBtnDiv.classList.add("checkbox-btn");
  checkboxBtnDiv.innerHTML = task.completed ? '<i class="fa fa-check-circle" style="color: #007bff"></i>' : '<i class="fa fa-circle-thin"></i>';
  checkboxBtnDiv.addEventListener("click", () => toggleTaskCompletion(index));

  const taskTitle = document.createElement("h4");
  taskTitle.classList.add("title-text");
  taskTitle.innerText = task.taskTitle;
  if (task.completed) {
    taskTitle.style.textDecoration = "line-through";
    taskTitle.style.fontWeight = "500";
  }

  const taskPriority = document.createElement("span");
  taskPriority.innerHTML = `<h4>[${task.priority.toUpperCase()}]</h4>`;

  const deleteTaskDiv = document.createElement("div");
  deleteTaskDiv.id = "deleteTask";
  deleteTaskDiv.innerHTML = '<i class="fa fa-trash-o"></i>';
  deleteTaskDiv.addEventListener("click", () => {
    popup.classList.remove("hidden");
    confirmAction.classList.remove("hidden");
    document.getElementById("question").textContent = `Are You Sure Want to Delete "${task.taskTitle}" Task?`;
    disableScroll();
    confirmBtn.addEventListener("click", () => {
      deleteTask(index);
      hidePopup();
    });
  });

  const taskInfoDiv = document.createElement("div");
  taskInfoDiv.classList.add("task-info");
  taskInfoDiv.innerHTML = `
    <p>Added: <span>${task.added}</span></p>
    <p>Deadline: <span class="deadline-date">${task.deadline}</span></p>
  `;

  // Append elements
  taskTitleDiv.appendChild(checkboxBtnDiv);
  taskTitleDiv.appendChild(taskTitle);
  taskTitleDiv.appendChild(taskPriority);
  taskPriority.appendChild(deleteTaskDiv);
  taskDiv.appendChild(taskTitleDiv);
  taskDiv.appendChild(taskInfoDiv);

  return taskDiv;
}

// "Toggle/Switch" Checkbox for task completion status
function toggleTaskCompletion(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function hidePopup() {
  popup.classList.add("hidden");
  confirmAction.classList.add("hidden");
  enableScroll();
}

// Delete one of task
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function deleteAllTasks() {
  popup.classList.remove("hidden");
  confirmAction.classList.remove("hidden");
  document.getElementById("question").textContent = `Are You Sure Want to Delete All Tasks?`;
  disableScroll();
  confirmBtn.addEventListener("click", () => {
    localStorage.removeItem("tasks");
    displayTasks();
    hidePopup();
  });
}

function clearLocalStorage() {
  popup.classList.remove("hidden");
  confirmAction.classList.remove("hidden");
  document.getElementById("question").textContent = `Are You Sure Want To Clear All Saved Data?\n(include profile and all task)`;
  disableScroll();
  confirmBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
}

// scroll handler
function disableScroll() {
  document.body.classList.add("disable-scrolling");
}

function enableScroll() {
  document.body.classList.remove("disable-scrolling");
}

loadProfile();
updateTime();
setInterval(updateTime, 1000);
displayTasks();
