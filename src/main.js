const newTaskInput = document.getElementById('newTaskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Елементи модального вікна
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Змінні для збереження стану під час редагування
let currentEditId = null;
let currentEditSpan = null;

// Завдання з LocalStorage
function getTasks() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Вивід завдання на сторінку
function loadTasks() {
    const tasks = getTasks();
    taskList.innerHTML = '';
    tasks.forEach(task => {
        renderTask(task);
    });
}

// Відмальовування завдання
function renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    const span = document.createElement('span');
    span.textContent = task.text;

    // редагування
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редагувати';
    editBtn.style.marginLeft = '10px';
    editBtn.onclick = () => editTask(task.id, span);

    // видалення
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Видалити';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.onclick = () => deleteTask(task.id, li);

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// Додавання завдання
addBtn.onclick = () => {
    const text = newTaskInput.value.trim();
    if (!text) return;

    const tasks = getTasks();
    const newTask = { id: Date.now().toString(), text };
    tasks.push(newTask);
    saveTasks(tasks);

    renderTask(newTask);
    newTaskInput.value = '';
};

// Відкриття модального вікна для редагування
function editTask(id, span) {
    currentEditId = id;
    currentEditSpan = span;
    editTaskInput.value = span.textContent; // старий текст
    editModal.showModal();
}

// Збереження змін у модальному вікні
saveEditBtn.onclick = () => {
    const newText = editTaskInput.value.trim();
    if (newText !== '') {
        const tasks = getTasks();
        const task = tasks.find(t => t.id === currentEditId);
        if (task) {
            task.text = newText;
            saveTasks(tasks);
            currentEditSpan.textContent = newText;
        }
        editModal.close(); // Закрити вікно після збереження
    }
};

// Скасування редагування
cancelEditBtn.onclick = () => {
    editModal.close();
};

// Видалення завдання
function deleteTask(id, li) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    li.remove();
}

// Запуск при завантаженні сторінки для першого разу
loadTasks();
