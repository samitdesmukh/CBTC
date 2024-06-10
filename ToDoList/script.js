// const inputBox = document.getElementById("input-box");
// const listcontainer = document.getElementById("list-container");
// function addTask(){
//     if(inputBox.value == ''){
//         alert("you must write something !");
//     }
//     else{
//         let li = document.createElement("li");
//         li.innerHTML = inputBox.value;
//         listcontainer.appendChild(li);
//         let span = document.createComment("span");
//         span.innerHTML = "\u00d7";
//         li.appendChild(span);
//     }
// }


document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const listContainer = document.getElementById('list-container');

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            createTaskElement(task.text, task.isCompleted, task.addedAt, task.completedAt);
        });
    }

    function saveTasks() {
        const tasks = [];
        listContainer.querySelectorAll('li').forEach(taskElement => {
            const taskText = taskElement.querySelector('.task-text').textContent;
            const isCompleted = taskElement.classList.contains('checked');
            const addedAt = taskElement.dataset.addedAt;
            const completedAt = taskElement.dataset.completedAt || null;
            tasks.push({ text: taskText, isCompleted, addedAt, completedAt });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(taskText, isCompleted, addedAt, completedAt) {
        const listItem = document.createElement('li');

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.textContent = taskText;

        const taskTimeSpan = document.createElement('span');
        taskTimeSpan.classList.add('task-time');
        taskTimeSpan.textContent = ` - Added at ${new Date(addedAt).toLocaleString()}`;

        listItem.dataset.addedAt = addedAt;
        
        const taskDetailsDiv = document.createElement('div');
        taskDetailsDiv.classList.add('task-details');
        taskDetailsDiv.appendChild(taskTextSpan);
        taskDetailsDiv.appendChild(taskTimeSpan);

        if (isCompleted) {
            listItem.classList.add('checked');
            listItem.dataset.completedAt = completedAt;
            taskTimeSpan.textContent += ` - Completed at ${new Date(completedAt).toLocaleString()}`;
        }

        listItem.appendChild(taskDetailsDiv);

        listItem.addEventListener('click', function() {
            if (this.classList.contains('checked')) {
                this.classList.remove('checked');
                taskTimeSpan.textContent = ` - Added at ${new Date(addedAt).toLocaleString()}`;
                delete this.dataset.completedAt;
            } else {
                this.classList.add('checked');
                const completedAt = new Date().toISOString();
                this.dataset.completedAt = completedAt;
                taskTimeSpan.textContent = ` - Added at ${new Date(addedAt).toLocaleString()} - Completed at ${new Date(completedAt).toLocaleString()}`;
            }
            saveTasks();
        });

        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.classList.add('close');
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation();  // Prevent the click event from bubbling up to the list item
            listContainer.removeChild(listItem);
            saveTasks();
        });

        listItem.appendChild(closeButton);
        listContainer.appendChild(listItem);
    }

    function addTask() {
        const taskText = inputBox.value.trim();
        if (taskText === '') return;
        const addedAt = new Date().toISOString();
        createTaskElement(taskText, false, addedAt, null);
        saveTasks();
        inputBox.value = '';
    }

    document.querySelector('button').addEventListener('click', addTask);
    inputBox.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    loadTasks();
});
