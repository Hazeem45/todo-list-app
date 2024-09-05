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

  if (taskTitle && deadline) {
    const task = {
      taskTitle: taskTitle,
      priority: priority,
      deadline: `${formatDate(deadline)}`,
      added: formatDate(date),
      completed: false,
    };
    saveTask(task);
    displayTasks();
  } else {
    alert("input field can't be empty!");
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
  taskTitle.id = "taskTitle";
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
    if (confirm("Delete This Task?")) {
      deleteTask(index);
    }
  });

  const taskInfoDiv = document.createElement("div");
  taskInfoDiv.classList.add("task-info");
  taskInfoDiv.innerHTML = `
    <p>Added: <span>${task.added}</span></p>
    <p>Deadline: <span id="taskDeadline">${task.deadline}</span></p>
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

// Delete one of task
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function deleteAllTasks() {
  if (confirm("Are You Sure Want To Delete All Tasks?")) {
    localStorage.removeItem("tasks");
    displayTasks();
  }
}

function clearLocalStorage() {
  if (confirm("Are You Sure Want To Clear All Saved Data?\n(include profile and all task)")) {
    localStorage.clear();
    location.reload();
  }
}

loadProfile();
updateTime();
setInterval(updateTime, 1000);
displayTasks();
