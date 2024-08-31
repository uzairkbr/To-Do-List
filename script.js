const html = document.getElementsByTagName("html")[0];
const toDoList = document.querySelector(".toDo-list");
const inputField = document.querySelector(".inputField");
const tasksStatus = document.querySelector(".tasks-status");
const itemsLeft = document.querySelector(".items-left");
const allTasks = document.querySelector(".all-tasks");
const activeTasks = document.querySelector(".active-tasks");
const completedTasks = document.querySelector(".completed-tasks");
const deleteCompleted = document.querySelector(".clear-completed-tasks");
const iconLight = document.querySelector(".icon-light");
const iconDark = document.querySelector(".icon-dark");

let tasksArray = getTasksFromLocalStorage("todo") || [];
let activeFilter = "all";

function setTasksToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(tasksArray));
}

function getTasksFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

function createElement(type, classes = [], textContent = '') {
  const element = document.createElement(type);

  if (classes.length) {
    element.classList.add(...classes);
  }

  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function updateUI() {
  toDoList.innerHTML = "";
  tasksArray.forEach(renderTask);

  if (tasksArray.length !== 0) {
    tasksStatus.classList.remove("hide");
    itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length + " items left";
  }
}

function renderTask(task) {
  const li = createElement("li", ["task-item", "flex", "justify-between", "align-center"]);
  li.setAttribute("data-id", task.id);

  const checkbox = createElement("input", ["task-checkbox", "cursor-pointer"]);
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  
  const taskText = createElement("span", ["task-text"], task.text);
  const deleteIcon = createElement("i", ["fa-light", "fa-x", "task-delete", "cursor-pointer"])
  
  li.appendChild(checkbox);
  li.appendChild(taskText);
  li.appendChild(deleteIcon);
  toDoList.appendChild(li);

  styleTaskText(task, taskText, deleteIcon);

  checkbox.addEventListener("change", function () {
    task.completed = checkbox.checked;
    const deleteIcon = li.lastChild;
    setTasksToLocalStorage();
    styleTaskText(checkbox, taskText, deleteIcon);
  });

  deleteIcon.addEventListener("click", function () {
    const taskId = li.getAttribute("data-id");
    tasksArray = tasksArray.filter(t => t.id !== parseInt(taskId));
    setTasksToLocalStorage();
    updateUI();

    if (tasksArray.length) {
      tasksStatus.classList.add("hide");
      itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length + " items left";
    }
  });

  filterTasks(activeFilter);
}

function styleTaskText(task, element, deleteIcon) {
  if (task.checked || task.completed) {
    element.style.opacity = "0.3";
    deleteIcon.style.opacity = "0.3";
    element.style.textDecoration = "line-through";
  } else {
    element.style.opacity = "1";
    deleteIcon.style.opacity = "1";
    element.style.textDecoration = "none";
  }
}

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    
    const taskTextValue = inputField.value.trim();
    inputField.value = "";

    let isDuplicateTask = tasksArray.some(task => task.text === taskTextValue);

    if (!isDuplicateTask && taskTextValue !== "") {
      const taskId = Date.now();

      const taskObj = {
        id: taskId,
        text: taskTextValue,
        active: true,
        completed: false
      };

      tasksArray.push(taskObj);

      const li = createElement("li", ["task-item", "flex", "justify-between", "align-center"]);
      li.setAttribute("data-id", taskId);

      const checkbox = createElement("input", ["task-checkbox", "cursor-pointer"]);
      checkbox.type = "checkbox";

      const taskText = createElement("span", ["task-text"], taskTextValue);
      const deleteIcon = createElement("i", ["fa-light", "fa-x", "task-delete", "cursor-pointer"]);

      li.appendChild(checkbox);
      li.appendChild(taskText);
      li.appendChild(deleteIcon);
      toDoList.appendChild(li);

      if (tasksArray.length !== 0) {
        tasksStatus.classList.remove("hide");
        itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length + " items left";
      }

      deleteIcon.addEventListener("click", function () {
        toDoList.removeChild(li);

        const taskId = li.getAttribute("data-id");
        const taskIndex = tasksArray.findIndex(task => task.id == taskId);

        if (taskIndex > -1) {
            const index = tasksArray.splice(taskIndex, 1);
            setTasksToLocalStorage();
        }

        if (!tasksArray.length) {
          tasksStatus.classList.add("hide");
          itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length + " items left";
        }
      });

      checkbox.addEventListener("change", function () {
        const taskId = li.getAttribute("data-id");
        const deleteIcon = li.lastChild;
        const taskObj = tasksArray.find(task => task.id == taskId);
    
        taskObj.completed = checkbox.checked;

        styleTaskText(checkbox, taskText, deleteIcon);
        setTasksToLocalStorage();
      });

    } else {
      alert("Task is already available in your Todo List");
    }
    
    filterTasks(activeFilter);
    setTasksToLocalStorage();
  }
});

deleteCompleted.addEventListener("click", function (e) {
  e.preventDefault();

  tasksArray = tasksArray.filter(task => !task.completed);

  activeFilter = "all";

  if (!tasksArray.length) {
      tasksStatus.classList.add("hide");
  }

  updateUI();
  updateFilterButton();
  setTasksToLocalStorage();
});

allTasks.addEventListener("click", function (e) {
  e.preventDefault();
  activeFilter = "all";
  filterTasks(activeFilter);
});

activeTasks.addEventListener("click", function (e) {
  e.preventDefault();
  activeFilter = "active";
  filterTasks(activeFilter);
});

completedTasks.addEventListener("click", function (e) {
  e.preventDefault();
  activeFilter = "completed";
  filterTasks(activeFilter);
});

function filterTasks(filter) {
  const taskItems = document.querySelectorAll(".task-item");
  let countItems = 0;

  taskItems.forEach(item => {
    const taskId = item.getAttribute("data-id");
    const taskObj = tasksArray.find(task => task.id == taskId);

    if (filter === "all") {
      item.style.display = "flex";
      countItems++;
    } else if (filter === "active") {
      if (taskObj.active && !taskObj.completed) {
        item.style.display = "flex";
        countItems++;
      } else {
        item.style.display = "none";
      }
    } else if (filter === "completed") {
      if (taskObj.completed) {
        item.style.display = "flex";
        countItems++;
      } else {
        item.style.display = "none";
      }
    }

    if (tasksArray.length) {
      itemsLeft.innerText = countItems === 1 ? countItems + " item left" : countItems + " items left";
    }
  });

  updateFilterButton();
}

const updateFilterButton = () => {
  const filters = {
    all: { all: "1", active: "0.3", completed: "0.3" },
    active: { all: "0.3", active: "1", completed: "0.3" },
    completed: { all: "0.3", active: "0.3", completed: "1" }
  };

  const opacity = filters[activeFilter];

  allTasks.style.opacity = opacity.all;
  activeTasks.style.opacity = opacity.active;
  completedTasks.style.opacity = opacity.completed;
};

const toggleTheme = (isDarkMode) => {
  html.classList.toggle("dark-mode", isDarkMode);
  iconLight.classList.toggle("hide", isDarkMode);
  iconDark.classList.toggle("hide", !isDarkMode);
};

iconLight.addEventListener("click", () => toggleTheme(true));
iconDark.addEventListener("click", () => toggleTheme(false));

getTasksFromLocalStorage();
updateUI(); 
