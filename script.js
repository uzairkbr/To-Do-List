const toDoList = document.querySelector(".toDo-list");
const inputField = document.querySelector(".inputField");
const tasksStatus = document.querySelector(".tasks-status");
const itemsLeft = document.querySelector(".items-left");

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

            if (taskTextValue !== "") {
                
                // adding unique id to object
                const taskId = Date.now();

                const taskObj = {
                    id: taskId,
                    text: taskTextValue,
                    active: true,
                    completed: false
                };

                tasksArray.push(taskObj);

                const li = document.createElement("li");
                li.classList.add("task-item");
                li.setAttribute("data-id", taskId);

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("task-checkbox");
                li.appendChild(checkbox);

                const taskText = document.createElement("span");
                taskText.classList.add("task-text");
                taskText.textContent = taskTextValue;
                li.appendChild(taskText);

                const deleteIcon = document.createElement("i");
                deleteIcon.classList.add("fa-light", "fa-x", "task-delete");
                li.appendChild(deleteIcon);

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
                    }

                    if (tasksArray.length === 0) {
                        tasksStatus.classList.add("hide");
                    }

                    itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length  + " items left";
                });

                checkbox.addEventListener("change", function() {
                    taskObj.completed = checkbox.checked;

                    if (checkbox.checked) {
                        taskText.style.textDecoration = "line-through";
                        taskText.style.opacity = "0.3";
                        checkbox.classList.add("task-checkbox-completed");
                    } else {
                        taskText.style.textDecoration = "none";
                        taskText.style.opacity = "1";
                    }

                });

                filterTasks(activeFilter);
            }
        }
    

    
// Event listener for clearing all completed tasks
clearCompleted.addEventListener("click", function(e) {
    e.preventDefault();

    tasksArray = tasksArray.filter(task => !task.completed);

    // I want to show all the tasks to user when the updation is completed
    activeFilter = "all";

    if (!tasksArray.length) {
        tasksStatus.classList.add("hide");
    }

    updateUI();
});



// Function to updating the UI
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

        // Event listener for deleting a task by clicking its icon 
        deleteIcon.addEventListener("click", function() {
            // Removing task from UI
            toDoList.removeChild(li);

            // removing task from array
            const taskIndex = tasksArray.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                tasksArray.splice(taskIndex, 1);
            }

            itemsLeft.innerText = tasksArray.length === 1 ? tasksArray.length + " item left" : tasksArray.length  + " items left";
            
            if (!tasksArray.length) {
                tasksStatus.classList.add("hide");
            }

        });


        // Event listener for checkbox change
        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;

            // checkbox is checked, which means the task is completed.
            if (checkbox.checked) {
                taskText.style.textDecoration = "line-through";
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

    taskItems.forEach(item => {
        const taskId = item.getAttribute("data-id");
        const taskObj = tasksArray.find(task => task.id == taskId);

        if (filter === "all") {
            item.style.display = "flex"; 

        } else if (filter === "active") {
            if (taskObj.active && !taskObj.completed) {
                item.style.display = "flex"; 

            } else {
                item.style.display = "none";

            }
        } else if (filter === "completed") {
            if (taskObj.completed) {
                item.style.display = "flex";

            } else {
                item.style.display = "none";

            }
        }
    });

    updateFilterButton();
}



// Event listeners for light and dark mode 

iconLight.addEventListener("click", function(){
    document.body.style.backgroundColor = "#171823";
    iconDark.classList.remove("hide");
    iconLight.classList.add("hide");

    tasksContainer.classList.add("bg-color-black");
    inputContainer.classList.add("bg-color-black");
    taskItem.classList.add("bg-color-black");
    inputField.style.backgroundColor = "#000";
    inputCheckbox.classList.add("input-checkbox-dark");

});

iconDark.addEventListener("click", function(){
        document.body.style.backgroundColor = "#fafafa";
        iconLight.classList.remove("hide");
        iconDark.classList.add("hide");

        tasksContainer.classList.remove("bg-color-black");
        inputContainer.classList.remove("bg-color-black");
        taskItem.classList.remove("bg-color-black");

    });
});



// I want to change the color of active filter button to blue, and the rest to its default with opacity of 0.6

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

}
