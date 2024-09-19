"use strict";

const form = document.querySelector('.create-task-form');
const taskInput = document.querySelector('.task-input');
const collection = document.querySelector('.collection');
const clearButton = document.querySelector('.clear-tasks');
const filterInput = document.querySelector('.filter-input');

const TASKS_STORAGE_KEY = 'tasks';

document.addEventListener('DOMContentLoaded', renderTasks);
form.addEventListener('submit', addTask);
clearButton.addEventListener('click', removeTasks);
collection.addEventListener('click', removeTask);
filterInput.addEventListener('input', filterTasks);

function renderTasks() {
    if (getTasksFromLocalStorage()) {
        const tasks = JSON.parse(getTasksFromLocalStorage());

        tasks.forEach((task, index) => {
            createTask(task, index);
        });
    }
}

function getLastTasksIndex() {
    if (getTasksFromLocalStorage()) {
        return JSON.parse(getTasksFromLocalStorage()).length
    }

    return 0;
}

function createTask(task, index) {
    const li = document.createElement('li');
    li.innerHTML = task;
    li.classList.add('task');
    li.setAttribute('data-id', index)

    const button = document.createElement('button');
    button.innerHTML = 'x';
    button.className = 'button-icon button-delete'

    li.append(button);

    collection.append(li);
}

function addTask(event) {
    event.preventDefault();

    const currentForm = event.target;
    const inputValue = currentForm.task.value;

    if (!inputValue) {
        return;
    }

    const currentIndex = getLastTasksIndex();

    createTask(inputValue, currentIndex);
    setTaskToLocalStorage(inputValue);

    currentForm.reset();
}

function setTaskToLocalStorage(task) {
    let tasks = [];

    if (getTasksFromLocalStorage()) {
        tasks = JSON.parse(getTasksFromLocalStorage());
    }

    tasks.push(task);
    setTasksToLocalStorage(tasks);
}

function setTasksToLocalStorage(tasks) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function getTasksToLocalStorage() {
    return localStorage.getItem(TASKS_STORAGE_KEY);
}

function clearTasksFromLocalStorage() {
    localStorage.removeItem(TASKS_STORAGE_KEY);
}

function removeTasks() {
    collection.innerHTML = '';

    clearTasksFromLocalStorage();
}

function removeTask(event) {
    if (event.target.classList.contains('button-delete')) {
        // const li = event.target.parentElement;
        const li = event.target.closest('.task');
        const tasks = JSON.parse(getTasksFromLocalStorage());

        const filteredTasks = tasks.filter((task, index) => {
            return index.toString() !== li.getAttribute('data-id');
        });

        removeTasks();
        setTasksToLocalStorage(filteredTasks);
        renderTasks();
    }
}

function filterTasks(event) {
    const filterQuery = event.target.value;

    const tasks = collection.querySelectorAll('.task');

    tasks.forEach((task) => {
        const taskValue = task.firstChild.textContent;
        console.log(taskValue)
        if (!taskValue.includes(filterQuery)) {
            task.classList.add('hidden')
        } else {
            task.classList.remove('hidden')
        }
    })

    console.log(tasks)
    console.log(filterQuery)
}