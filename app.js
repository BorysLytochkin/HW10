"use strict";

// 1. Додати нові задачі +
// 2. Видаляти всі задачі +
// 3. Видаляти окремі задачі +
// 4. Пошук/фільтрація +
// 5. Зберігати в стореджі +
// 6. Редагування окремого завдання +

// Отримуємо необхідні DOM елементи
const form = document.querySelector('.create-task-form'); // Форма для створення задач
const taskInput = document.querySelector('.task-input'); // Поле для введення задачі
const collection = document.querySelector('.collection'); // Список задач
const clearButton = document.querySelector('.clear-tasks'); // Кнопка для видалення всіх задач
const filterInput = document.querySelector('.filter-input'); // Поле для фільтрації задач

// Ключ для збереження задач в LocalStorage
const TASKS_STORAGE_KEY = 'tasks';

// Додаємо обробники подій
document.addEventListener('DOMContentLoaded', renderTasks); // При завантаженні сторінки відображаємо задачі з LocalStorage
form.addEventListener('submit', addTask); // Додаємо задачу при сабміті форми
clearButton.addEventListener('click', removeTasks); // Видаляємо всі задачі при натисканні на кнопку
collection.addEventListener('click', function(event) {
    if (event.target.classList.contains('button-delete')) {
        removeTask(event);
    } else if (event.target.classList.contains('button-edit')) {
        toggleEditTask(event);
    }
});
filterInput.addEventListener('input', filterTasks); // Фільтруємо задачі при введенні тексту у поле

// Відображення задач з LocalStorage
function renderTasks() {
    if (getTasksFromLocalStorage()) {
        const tasks = JSON.parse(getTasksFromLocalStorage());

        // Створюємо елемент для кожної задачі
        tasks.forEach((task) => {
            createTask(task);
        });
    }
}

// Створення HTML-елементу для задачі
function createTask(task) {
    const li = document.createElement('li');
    const taskText = document.createElement('span'); // Обертаємо текст у span
    taskText.textContent = task.text;
    li.appendChild(taskText);
    
    li.classList.add('task');
    li.setAttribute('data-id', task.id); // Присвоюємо задачі унікальний ідентифікатор

    // Додаємо кнопку для видалення задачі
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.className = 'button-icon button-delete';

    // Додаємо кнопку для редагування задачі
    const editButton = document.createElement('button');
    editButton.textContent = '✎'; 
    editButton.className = 'button-icon button-edit';
    editButton.style.transform = 'rotate(90deg)';

    li.append(editButton); 
    li.append(deleteButton); 

    // Додаємо задачу до колекції (списку)
    collection.append(li);
}

// Додавання нової задачі
function addTask(event) {
    event.preventDefault(); // Відміняємо перезавантаження сторінки при сабміті

    const currentForm = event.target;
    const inputValue = currentForm.task.value; // Отримуємо значення з поля вводу

    if (!inputValue) {
        return; // Якщо поле порожнє, не додаємо задачу
    }

    const task = {
        id: Date.now(), // Унікальний ідентифікатор
        text: inputValue
    };

    createTask(task); // Створюємо нову задачу
    setTaskToLocalStorage(task); // Зберігаємо задачу в LocalStorage

    currentForm.reset(); // Очищаємо поле вводу
}

// Зберігаємо задачу в LocalStorage
function setTaskToLocalStorage(task) {
    let tasks = [];

    if (getTasksFromLocalStorage()) {
        tasks = JSON.parse(getTasksFromLocalStorage()); // Отримуємо існуючі задачі
    }

    tasks.push(task); // Додаємо нову задачу
    setTasksToLocalStorage(tasks); // Оновлюємо LocalStorage
}

// Оновлюємо LocalStorage
function setTasksToLocalStorage(tasks) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)); // Зберігаємо задачі у форматі JSON
}

// Отримуємо задачі з LocalStorage
function getTasksFromLocalStorage() {
    return localStorage.getItem(TASKS_STORAGE_KEY); // Повертаємо задачі у вигляді рядка
}

// Очищаємо LocalStorage
function clearTasksFromLocalStorage() {
    localStorage.removeItem(TASKS_STORAGE_KEY); // Видаляємо всі задачі з LocalStorage
}

// Видалення всіх задач
function removeTasks() {
    collection.innerHTML = ''; // Очищаємо HTML-код списку задач

    clearTasksFromLocalStorage(); // Очищаємо LocalStorage
}

// Видалення окремої задачі
function removeTask(event) {
    const li = event.target.closest('.task'); // Знаходимо батьківський елемент (задачу)
    const taskId = li.getAttribute('data-id'); // Отримуємо ID задачі
    const tasks = JSON.parse(getTasksFromLocalStorage()); // Отримуємо задачі з LocalStorage

    // Фільтруємо задачі, залишаючи лише ті, які не мають ID видаленої задачі
    const filteredTasks = tasks.filter(task => task.id.toString() !== taskId);

    setTasksToLocalStorage(filteredTasks); // Зберігаємо оновлений список задач
    li.remove(); // Видаляємо задачу з інтерфейсу
}

// Перемикання режиму редагування завдання
function toggleEditTask(event) {
    const li = event.target.closest('.task'); // Знаходимо батьківський елемент (задачу)
    const taskId = li.getAttribute('data-id'); // Отримуємо ID задачі
    const tasks = JSON.parse(getTasksFromLocalStorage()); // Отримуємо задачі з LocalStorage
    const task = tasks.find(task => task.id.toString() === taskId); // Знаходимо завдання по ID

    const taskText = li.querySelector('span'); // Отримуємо поточний текст завдання

    if (li.querySelector('.edit-input')) { // Якщо поле введення вже існує
        const input = li.querySelector('.edit-input'); // Отримуємо це поле

        const newText = input.value.trim(); // Отримуємо новий текст завдання

        if (newText !== "") {
            task.text = newText; // Оновлюємо текст завдання в об'єкті
            setTasksToLocalStorage(tasks); // Оновлюємо LocalStorage
            taskText.textContent = newText; // Відображаємо новий текст
        }

        input.replaceWith(taskText); // Закриваємо поле введення і показуємо оновлений текст
    } else { // Якщо поля введення немає
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text; // Заповнюємо поле введення поточним текстом завдання
        input.className = 'edit-input'; 

        taskText.replaceWith(input); // Замінюємо текст на поле введення

        input.focus(); // Автоматично фокусуємо на полі введенн

        input.addEventListener('blur', function() {
            const newText = input.value.trim(); 

            if (newText !== "") {
                task.text = newText; // Оновлюємо текст завдання в об'єкті
                setTasksToLocalStorage(tasks); // Оновлюємо LocalStorage
                taskText.textContent = newText; // Відображаємо новий текст
            }

            input.replaceWith(taskText); // Закриваємо поле введення і показуємо оновлений текст
        });
    }
}

// Фільтрація задач
function filterTasks(event) {
    const filterQuery = event.target.value; // Отримуємо значення з поля фільтрації

    const tasks = collection.querySelectorAll('.task'); // Отримуємо всі задачі

    tasks.forEach((task) => {
        const taskValue = task.firstChild.textContent; // Отримуємо текст задачі
        if (!taskValue.includes(filterQuery.trim())) {
            task.classList.add('hidden'); // Ховаємо задачі, які не відповідають запиту
        } else {
            task.classList.remove('hidden'); // Показуємо задачі, що відповідають запиту
        }
    });
}
