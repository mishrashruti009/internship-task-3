const listInput = document.getElementById("listInput");
const createListBtn = document.getElementById("createList");
const listsContainer = document.getElementById("listsContainer");
const count = document.getElementById("count");

let lists = JSON.parse(localStorage.getItem("todoLists")) || [];

function save(){
localStorage.setItem("todoLists", JSON.stringify(lists));
}

function getStatus(task){
if(task.completed) return "completed";

let now = new Date();
let due = new Date(task.time);

return due > now ? "not-started" : "pending";
}

function render(){

listsContainer.innerHTML = "";

let today = new Date().toDateString();
let todayCount = 0;

lists.forEach((list, listIndex)=>{

let sections = {
"not-started": [],
"pending": [],
"completed": []
};

list.tasks.forEach((task, taskIndex)=>{

let status = getStatus(task);
let dueDate = new Date(task.time);
let isToday = dueDate.toDateString() === today;

if(isToday && !task.completed){
todayCount++;
}

let taskHTML = `
<li class="${status}">
<div onclick="toggleTask(${listIndex},${taskIndex})">
${task.text}
<small>${new Date(task.time).toLocaleString()}</small>
<span class="badge">${status}</span>
${isToday && !task.completed ? `<span class="badge">DUE TODAY</span>` : ""}
</div>

<span class="delete" onclick="deleteTask(${listIndex},${taskIndex})">❌</span>
</li>
`;

sections[status].push(taskHTML);

});

function section(title, items){
if(items.length === 0) return "";
return `<h4 class="section-title">${title}</h4>${items.join("")}`;
}

const div = document.createElement("div");
div.className = "list";

div.innerHTML = `
<div class="list-header">
<h3>${list.name}</h3>
<span class="delete" onclick="deleteList(${listIndex})">🗑</span>
</div>

<div class="task-input">
<input placeholder="Task..." class="taskText">
<input type="datetime-local" class="taskTime">
<button class="addTaskBtn">Add</button>
</div>

<ul class="tasks">
${section("🔵 Not Started", sections["not-started"])}
${section("🟠 Pending", sections["pending"])}
${section("🟢 Completed", sections["completed"])}
</ul>
`;

listsContainer.appendChild(div);

// ✅ attach event listeners properly
const textInput = div.querySelector(".taskText");
const timeInput = div.querySelector(".taskTime");
const addBtn = div.querySelector(".addTaskBtn");

// button click
addBtn.addEventListener("click", () => {
addTask(listIndex, textInput, timeInput);
});

// enter key
textInput.addEventListener("keydown", (e)=>{
if(e.key === "Enter"){
addTask(listIndex, textInput, timeInput);
}
});

});

count.innerText = todayCount;
}

function createList(){
let name = listInput.value.trim();
if(name === "") return;

lists.push({ name:name, tasks:[] });

listInput.value = "";
save();
render();
}

function addTask(listIndex, textInput, timeInput){

let text = textInput.value.trim();
let time = timeInput.value;

if(text === "" || time === "") return;

lists[listIndex].tasks.push({
text: text,
time: time,
completed: false
});

textInput.value = "";
timeInput.value = "";
textInput.focus();

save();
render();
}

function toggleTask(listIndex, taskIndex){
lists[listIndex].tasks[taskIndex].completed =
!lists[listIndex].tasks[taskIndex].completed;

save();
render();
}

function deleteTask(listIndex, taskIndex){
lists[listIndex].tasks.splice(taskIndex,1);
save();
render();
}

function deleteList(index){
lists.splice(index,1);
save();
render();
}

createListBtn.addEventListener("click", createList);

listInput.addEventListener("keydown",(e)=>{
if(e.key === "Enter") createList();
});

render();