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
// global variable to store the action to be executed on confirmBtn
let currentAction = null;

// event listener for confirmBtn button, will be executed depending on the contents of the "currentAction" variable
confirmBtn.addEventListener("click", () => {
  if (currentAction) {
    currentAction();
    hidePopup();
  }
});

// event listener for saveProfileBtn to Save Profile
saveProfileBtn.addEventListener("click", function () {
  const name = nameInput.value;
  const job = jobInput.value;
  if (!name) {
    document.querySelectorAll(".error-message")[1].classList.remove("hidden");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: "auto",
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "warning",
      title: "Name field cannot be empty!",
    });
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

// event listener for show popup Edit Profile
editProfileBtn.addEventListener("click", function () {
  showPopup(true);
});
document.querySelector(".profile").addEventListener("click", function () {
  showPopup(true);
});

// event listener for submitTaskBtn to Create new task
submitTaskBtn.addEventListener("click", function () {
  const taskTitle = taskText.value;
  const priority = priorityLevel.value;
  const deadline = taskDate.value;
  const date = new Date();

  if (taskTitle && priority && deadline) {
    const task = {
      taskTitle: taskTitle,
      priority: priority,
      deadline: `${formatDate(deadline, false)}`,
      added: formatDate(date, false),
      completed: false,
    };
    saveTask(task);
    displayTasks();
    document.querySelectorAll(".error-message")[0].classList.add("hidden");
    Swal.fire({
      title: "Created!",
      text: `"${taskTitle}" task has been created.`,
      icon: "success",
      confirmButtonText: "CLOSE",
      confirmButtonColor: "#007bff",
      timer: 3000,
      timerProgressBar: true,
    });

    // reset form value
    taskText.value = "";
    priorityLevel.value = "low";
    taskDate.value = deadlineDate();
  } else {
    document.querySelectorAll(".error-message")[0].classList.remove("hidden");
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: "auto",
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "warning",
      title: "Task field cannot be empty!",
    });
  }
});

// Format Date DAY MONTH YEAR
function formatDate(datestring, isHeader) {
  const date = new Date(datestring);
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (isHeader) {
    return `${day} ${fullMonths[month]} ${year}`;
  } else {
    const month = date.toDateString().split(" ", 2).pop();
    return `${day} ${month} ${year}`;
  }
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

// Update Time and Date
function updateTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const dateString = formatDate(date, true);
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
  taskDate.value = deadlineDate();
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
  priorityLevel.value = "low";
  taskDate.value = deadlineDate();
}

// default deadline date
function deadlineDate() {
  // set today's date as the deadline
  const date = new Date().toLocaleDateString();
  const splitedDate = date.split("/");
  const paddedDay = (splitedDate[0] < 10 ? "0" : "") + splitedDate[0];
  const paddedMonth = (splitedDate[1] < 10 ? "0" : "") + splitedDate[1];
  return `${splitedDate[2]}-${paddedDay}-${paddedMonth}`;
}

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
      // set the deadline at 11:30pm on that day(today)
      taskDeadline.setHours(23, 30, 0, 0);

      if (taskDeadline < today) {
        overdueContainer.appendChild(taskElement);
      } else {
        ongoingContainer.appendChild(taskElement);
      }
    }
  });

  // container task information if task empyt
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
  const today = new Date();
  const taskDeadline = new Date(task.deadline);
  taskDeadline.setHours(23, 30, 0, 0);

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
  } else {
    if (taskDeadline < today) {
      taskTitle.style.color = "rgba(244, 64, 52, 0.9)";
    }
  }

  const priorityAndDelete = document.createElement("span");
  priorityAndDelete.innerHTML = `<h4>[${task.priority.toUpperCase()}]</h4>`;

  const deleteTaskDiv = document.createElement("div");
  deleteTaskDiv.id = "deleteTask";
  deleteTaskDiv.innerHTML = '<i class="fa fa-trash-o"></i>';
  deleteTaskDiv.addEventListener("click", () => {
    showPopup(false);
    document.getElementById("question").textContent = `Are You Sure Want to Delete "${task.taskTitle}" Task?`;

    // Set currentAction to delete one of task function
    currentAction = () => {
      deleteTask(index);
    };
  });

  const taskInfoDiv = document.createElement("div");
  taskInfoDiv.classList.add("task-info");
  taskInfoDiv.innerHTML = `
    <p>Added: <span>${task.added}</span></p>
    <p class="deadline">Deadline: <span class="deadline-date">${task.deadline}</span></p>
  `;

  const deadlineParagraph = taskInfoDiv.querySelector("p > span.deadline-date").parentElement;
  if (task.completed) {
    deadlineParagraph.style.textDecoration = "line-through";
  } else {
    if (taskDeadline < today) {
      deadlineParagraph.style.color = "rgba(244, 64, 52, 0.9)";
    }
  }

  // Append elements
  taskTitleDiv.appendChild(checkboxBtnDiv);
  taskTitleDiv.appendChild(taskTitle);
  taskTitleDiv.appendChild(priorityAndDelete);
  priorityAndDelete.appendChild(deleteTaskDiv);
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
  const title = tasks[index].taskTitle;
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  Swal.fire({
    title: "Deleted!",
    text: `"${title}" task has been deleted.`,
    icon: "success",
    confirmButtonText: "CLOSE",
    confirmButtonColor: "#007bff",
    timer: 3000,
    timerProgressBar: true,
  });
}

function deleteAllTasks() {
  const tasks = localStorage.getItem("tasks");
  if (tasks) {
    showPopup(false);
    document.getElementById("question").textContent = `Are You Sure Want to Delete All Tasks?`;

    // Set currentAction to delete ALL task function
    currentAction = () => {
      localStorage.removeItem("tasks");
      displayTasks();
      Swal.fire({
        title: "Deleted!",
        text: `Successfully deleted all Tasks.`,
        icon: "success",
        confirmButtonText: "CLOSE",
        confirmButtonColor: "#007bff",
        timer: 3000,
        timerProgressBar: true,
      });
    };
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: "auto",
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "info",
      title: "You don't have any tasks",
    });
  }
}

function clearLocalStorage() {
  showPopup(false);
  document.getElementById("question").textContent = `Are You Sure Want To Clear All Saved Data?\n(include profile and all task)`;

  // Set currentAction to clear localStorage function
  currentAction = () => {
    localStorage.clear();
    location.reload();
  };
}

// display popup
function showPopup(isPopupEditProfile) {
  disableScroll();
  popup.classList.remove("hidden");
  if (isPopupEditProfile) {
    profilePopup.classList.remove("hidden");
  } else {
    confirmAction.classList.remove("hidden");
  }
}

// scroll handler
function disableScroll() {
  document.body.classList.add("overflow-hidden");
}

function enableScroll() {
  document.body.classList.remove("overflow-hidden");
}

loadProfile();
displayTasks();
updateTime();
setInterval(updateTime, 1000);
