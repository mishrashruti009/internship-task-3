"use strict";
// ENUM
var Status;
(function (Status) {
    Status["Pending"] = "Pending";
    Status["Completed"] = "Completed";
})(Status || (Status = {}));
// GENERIC STORAGE
class AppStorage {
    constructor(key) {
        this.key = key;
    }
    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
    load() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }
}
// DOM
const input = document.getElementById("taskInput");
const timeInput = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const themeBtn = document.getElementById("themeToggle");
// STATE
const storage = new AppStorage("tasks");
let tasks = storage.load();
// SAVE + RENDER
function render() {
    list.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
      <div>
        ${task.text}
        <br>
        <small>${new Date(task.time).toLocaleString()}</small>
        <br>
        <b>${task.completed ? Status.Completed : Status.Pending}</b>
      </div>
      <span class="delete">❌</span>
    `;
        li.addEventListener("click", () => {
            task.completed = !task.completed;
            storage.save(tasks);
            render();
        });
        li.querySelector(".delete").addEventListener("click", (e) => {
            e.stopPropagation();
            tasks = tasks.filter(t => t.id !== task.id);
            storage.save(tasks);
            render();
        });
        list.appendChild(li);
    });
}
// ADD
addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    const time = timeInput.value;
    if (!text || !time)
        return;
    const newTask = {
        id: Date.now(),
        text,
        time,
        completed: false
    };
    tasks.push(newTask);
    storage.save(tasks);
    render();
    input.value = "";
    timeInput.value = "";
});
// DARK MODE
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
// INIT
render();
