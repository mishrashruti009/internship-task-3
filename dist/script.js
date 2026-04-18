const input = document.getElementById("taskInput");
const timeInput = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const themeBtn = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

// SAVE
function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// RENDER
function render(){
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        ${task.text}
        <br>
        <small>${new Date(task.time).toLocaleString()}</small>
      </div>
      <span class="delete">❌</span>
    `;

    // toggle complete
    li.addEventListener("click", () => {
      task.completed = !task.completed;
      save();
      render();
    });

    // delete
    li.querySelector(".delete").addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      save();
      render();
    });

    list.appendChild(li);
  });
}

// ADD BUTTON
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  const time = timeInput.value;

  if(!text || !time) return;

  tasks.push({
    id: Date.now(),
    text,
    time,
    completed:false
  });

  input.value = "";
  timeInput.value = "";

  save();
  render();
});

// DARK MODE
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// INIT
render();