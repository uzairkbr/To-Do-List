const toDoList = document.querySelector(".toDo-list");
const inputField = document.querySelector(".inputField");
const tasksStatus = document.querySelector(".tasks-status");
const itemsLeft = document.querySelector(".items-left");
const taskDelete = document.querySelector(".task-delete");
const html = document.getElementsByTagName("html")[0];
const inputContainer = document.querySelector(".inputContainer");
const tasksContainer = document.querySelector(".tasks-Container");
const taskItem = document.querySelector(".task-item");
const inputCheckbox = document.querySelector("#input-checkbox");
const allTasks = document.querySelector(".all-tasks");
const activeTasks = document.querySelector(".active-tasks");
const completedTasks = document.querySelector(".completed-tasks");
const clearCompleted = document.querySelector(".clear-completed-tasks");
const iconLight = document.querySelector(".icon-light");
const iconDark = document.querySelector(".icon-dark");

let tasksArray = [];
let activeFilter = "all";


document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();

        const taskTextValue = inputField.value.trim();

        let isAvailable = false;

        tasksArray.forEach(task => {
            if (task.text === taskTextValue) {
                isAvailable = true;
            }
        })

        if (!isAvailable) {

            if (taskTextValue !== "") {
                const taskId = Date.now();

                const taskObj = {
                    id: taskId,
                    text: taskTextValue,
                    active: true,
                    completed: false
                };

                tasksArray.push(taskObj);

                // To add the following to each list item.
                // 1) Checkbox
                // 2) Span ( text )
                // 3) Icon
                // 4) Append it to list ( unordered list )

                const li = document.createElement("li");
                li.classList.add("task-item");
                li.setAttribute("data-id", taskId);

                // 1
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("task-checkbox");
                li.appendChild(checkbox);

                // 2
                const taskText = document.createElement("span");
                taskText.classList.add("task-text");
                taskText.textContent = taskTextValue;
                li.appendChild(taskText);

                // 3
                const deleteIcon = document.createElement("i");
                deleteIcon.classList.add("fa-light", "fa-x", "task-delete");
                li.appendChild(deleteIcon);

                // 4
                toDoList.appendChild(li);

                if (tasksArray.length !== 0) {
                    tasksStatus.classList.remove("hide");
                }

                inputField.value = "";
                itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length  + " items left";

                deleteIcon.addEventListener("click", function() {
                    // Remove task from UI
                    toDoList.removeChild(li);

                    // Remove task from array
                    const taskId = li.getAttribute("data-id");
                    const taskIndex = tasksArray.findIndex(task => task.id == taskId);

                    if (taskIndex > -1) {
                        tasksArray.splice(taskIndex, 1);
                        setTasksToLocalStorage();
                    }

                    if (tasksArray.length === 0) {
                        tasksStatus.classList.add("hide");
                    }


                    itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length  + " items left";
                });

                checkbox.addEventListener("change", function() {
                    const taskId = li.getAttribute("data-id");
                    const taskObj = tasksArray.find(task => task.id == taskId);
                
                    taskObj.completed = checkbox.checked;
                
                    if (checkbox.checked) {
                        taskText.style.textDecoration = "line-through";
                        taskText.style.opacity = "0.3";
                    } else {
                        taskText.style.textDecoration = "none";
                        taskText.style.opacity = "1";
                    }
                
                    setTasksToLocalStorage();
                });
        
                filterTasks(activeFilter);
            }
        } else {
            alert("Task is already available in your Todo List");
        }

    setTasksToLocalStorage();

}
});



// Event listener for clearing all completed tasks
clearCompleted.addEventListener("click", function(e) {
    e.preventDefault();

    // 1) Filter array and store all tasks which is not completed.
    // 2) update the UI with remaining tasks.
    
    tasksArray = tasksArray.filter(task => !task.completed);
    
    // show all the tasks in array ( except the completed ones ) 
    activeFilter = "all";
    
    if (!tasksArray.length) {
        tasksStatus.classList.add("hide");
    }
    
    updateUI();
    updateFilterButton();
    setTasksToLocalStorage();
});

function updateUI() {
    toDoList.innerHTML = "";

    tasksArray.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.setAttribute("data-id", task.id);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        checkbox.checked = task.completed;
        li.appendChild(checkbox);

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.style.textDecoration = "line-through";
            taskText.style.opacity = "0.3";
        } else {
            taskText.style.textDecoration = "none";
            taskText.style.opacity = "1";
        }

        li.appendChild(taskText);
        
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-light", "fa-x", "task-delete");
        li.appendChild(deleteIcon);

        toDoList.appendChild(li);
        
        deleteIcon.addEventListener("click", function() {
            const taskId = li.getAttribute("data-id");
            tasksArray = tasksArray.findIndex(t => t.id === task.id);
            setTasksToLocalStorage();
            updateUI();
        });

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            setTasksToLocalStorage();

            // checkbox is checked, which means the task is completed.
            if (checkbox.checked) {
                taskText.style.textDecoration = "line-through";
                taskText.style.opacity = "0.3";
            } else {
                taskText.style.textDecoration = "none";
                taskText.style.opacity = "1";
            }
        });
    });

    itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length  + " items left";
}

// Event listeners for filter buttons (all, active, completed)
allTasks.addEventListener("click", function(e) {
    e.preventDefault();
    activeFilter = "all";
    filterTasks(activeFilter);
});

activeTasks.addEventListener("click", function(e) {
    e.preventDefault();
    activeFilter = "active";
    filterTasks(activeFilter);
});

completedTasks.addEventListener("click", function(e) {
    e.preventDefault();
    activeFilter = "completed";
    filterTasks(activeFilter);
});

// Function to filter tasks based on its status
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

// Function to change the color of the active filter button to blue, and the rest to its default with opacity of 0.6
const updateFilterButton = () => {
    if (activeFilter === "all") {
        allTasks.style.opacity = "1";
        activeTasks.style.opacity = "0.3";
        completedTasks.style.opacity = "0.3";
    } else if (activeFilter === "active") {
        allTasks.style.opacity = "0.3";
        activeTasks.style.opacity = "1";
        completedTasks.style.opacity = "0.3";
    } else if (activeFilter === "completed") {
        allTasks.style.opacity = "0.3";
        activeTasks.style.opacity = "0.3";
        completedTasks.style.opacity = "1";
    }
};


// methods for setting and getting data from localstorege
function setTasksToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(tasksArray));
}

function getTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem("todo");
    if (savedTasks) {
        tasksArray = JSON.parse(savedTasks);
        activeFilter = "all";
        filterTasks(activeFilter);
        updateUI();
        if (!tasksArray.length) {
            tasksStatus.classList.add("hide");
        } else {
            tasksStatus.classList.remove("hide");
        }
    }
}

function hideCheckBox() {
    const checkboxes = document.querySelectorAll(".task-checkbox");
    checkboxes.forEach(checkbox => {
        checkbox.style.opacity = 0;
        checkbox.style.width = "0";
        checkbox.style.height = "0";
        checkbox.style.position = "absolute";
        checkbox.style.left = "-9999px";
        checkbox.style.overflow = "hidden";
        checkbox.style.clip = "rect(0 0 0 0)";
        checkbox.style.border = "0";
    });
}

iconLight.addEventListener("click", function() {
    html.classList.add("dark-mode");
    iconLight.classList.add("hide");
    iconDark.classList.remove("hide");
})

iconDark.addEventListener("click", function() {
    html.classList.remove("dark-mode");
    iconDark.classList.add("hide");
    iconLight.classList.remove("hide");
})

// when the page is refreshed render the tasks from localstorage.
getTasksFromLocalStorage();
