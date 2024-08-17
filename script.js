document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-task-btn');
    addButton.addEventListener('click', addTask);

    // Load tasks on page load
    loadTasks();

    // Initialize the Home page as the default view
    showPage('home');

    // Add event listeners for login and signup forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Login form submitted!');
            window.location.href = 'home.html'; // Redirect to home page after login
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            alert('Signup form submitted!');
            window.location.href = 'home.html'; // Redirect to home page after signup
        });
    }

    // Toggle between login and signup forms
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

    // Task checkbox event listener
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.parentNode.classList.add('completed');
            } else {
                this.parentNode.classList.remove('completed');
            }
        });
    });

    // Set interval to check due dates every minute
    setInterval(checkDueDates, 60000);
});

async function loadTasks() {
    // This simulates loading tasks; replace with actual fetch call
    const tasks = [
        { id: '1', text: 'Sample Task', completed: false, dueDate: '2024-08-10T12:00', priority: 'low' }
    ];
    tasks.forEach(task => {
        addTaskToDOM(task.id, task.text, task.completed, task.dueDate, task.priority);
    });
}

function addTaskToDOM(taskId, taskText, completed, dueDate, priority) {
    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.dataset.id = taskId;
    taskItem.classList.add(priority);
    if (completed) {
        taskItem.classList.add('completed');
    }

    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
        <div class="task-content">${taskText} - Due: ${new Date(dueDate).toLocaleString()}</div>
        <div class="task-due">Due: ${new Date(dueDate).toLocaleString()}</div>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
    `;

    taskItem.querySelector('.edit-button').addEventListener('click', () => editTask(taskItem, taskId));
    taskItem.querySelector('.delete-button').addEventListener('click', () => deleteTask(taskItem, taskId));

    taskList.appendChild(taskItem);

    // Update task checkbox listener
    taskItem.querySelector('.task-checkbox').addEventListener('change', function() {
        if (this.checked) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
    });
}

async function addTask() {
    const taskInput = document.getElementById('new-task');
    const dueDateInput = document.getElementById('task-due');
    const prioritySelect = document.getElementById('task-priority');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Simulating adding task
    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        dueDate: dueDate,
        priority: priority
    };

    addTaskToDOM(newTask.id, newTask.text, newTask.completed, newTask.dueDate, newTask.priority);

    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'low';
}

async function editTask(taskItem, taskId) {
    const taskContent = taskItem.querySelector('.task-content').textContent.split(' - Due: ')[0];
    const dueDate = taskItem.querySelector('.task-due').textContent.replace('Due: ', '');
    const priority = taskItem.classList.contains('low') ? 'low' : taskItem.classList.contains('medium') ? 'medium' : 'high';

    taskItem.innerHTML = `
        <input class="edit-input" value="${taskContent}">
        <input type="datetime-local" class="edit-due" value="${new Date(dueDate).toISOString().slice(0, 16)}">
        <select class="edit-priority">
            <option value="low" ${priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${priority === 'high' ? 'selected' : ''}>High</option>
        </select>
        <button class="save-button">Save</button>
        <button class="cancel-button">Cancel</button>
    `;

    taskItem.querySelector('.save-button').addEventListener('click', async () => {
        const updatedTask = {
            text: taskItem.querySelector('.edit-input').value,
            dueDate: taskItem.querySelector('.edit-due').value,
            priority: taskItem.querySelector('.edit-priority').value
        };

        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${taskItem.classList.contains('completed') ? 'checked' : ''}>
            <div class="task-content">${updatedTask.text} - Due: ${new Date(updatedTask.dueDate).toLocaleString()}</div>
            <div class="task-due">Due: ${new Date(updatedTask.dueDate).toLocaleString()}</div>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;
        taskItem.className = updatedTask.priority;
        taskItem.querySelector('.edit-button').addEventListener('click', () => editTask(taskItem, taskId));
        taskItem.querySelector('.delete-button').addEventListener('click', () => deleteTask(taskItem, taskId));
        
        // Update task checkbox listener
        taskItem.querySelector('.task-checkbox').addEventListener('change', function() {
            if (this.checked) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        });
    });

    taskItem.querySelector('.cancel-button').addEventListener('click', () => {
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${taskItem.classList.contains('completed') ? 'checked' : ''}>
            <div class="task-content">${taskContent} - Due: ${new Date(dueDate).toLocaleString()}</div>
            <div class="task-due">Due: ${new Date(dueDate).toLocaleString()}</div>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;
        taskItem.querySelector('.edit-button').addEventListener('click', () => editTask(taskItem, taskId));
        taskItem.querySelector('.delete-button').addEventListener('click', () => deleteTask(taskItem, taskId));
        
        // Update task checkbox listener
        taskItem.querySelector('.task-checkbox').addEventListener('change', function() {
            if (this.checked) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        });
    });
}

async function deleteTask(taskItem, taskId) {
    taskItem.remove(); // Simulating delete without backend
}

function filterTasks(filter) {
    const taskItems = document.querySelectorAll('#task-list li');
    taskItems.forEach(task => {
        switch (filter) {
            case 'completed':
                task.style.display = task.classList.contains('completed') ? '' : 'none';
                break;
            case 'pending':
                task.style.display = !task.classList.contains('completed') ? '' : 'none';
                break;
            case 'high':
                task.style.display = task.classList.contains('high') ? '' : 'none';
                break;
            default:
                task.style.display = '';
                break;
        }
    });
}

function checkDueDates() {
    const taskItems = document.querySelectorAll('#task-list li');
    taskItems.forEach(task => {
        const dueDateElem = task.querySelector('.task-due');
        if (dueDateElem) {
            const dueDate = new Date(dueDateElem.textContent.replace('Due: ', ''));
            const now = new Date();
            const timeDiff = dueDate - now;
            if (timeDiff < 86400000 && timeDiff > 0) { // Less than 24 hours
                task.style.border = '2px solid orange';
            }
        }
    });
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === `${pageId}-page`) {
            page.style.display = 'block';
        } else {
            page.style.display = 'none';
        }
    });
}
document.getElementById('home-btn').addEventListener('click', function() {
    showPage('home');
});

document.getElementById('todo-btn').addEventListener('click', function() {
    showPage('todo');
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        if (page.id === pageId + '-page') {
            page.style.display = 'block';
        } else {
            page.style.display = 'none';
        }
    });
}
