const listInput = document.getElementById("listInput")
const createListBtn = document.getElementById("createList")
const listsContainer = document.getElementById("listsContainer")
const themeToggle = document.getElementById("themeToggle")
let lists = JSON.parse(localStorage.getItem("todoLists")) || []
function save(){
localStorage.setItem("todoLists", JSON.stringify(lists))
}
function render(){
listsContainer.innerHTML=""
lists.forEach((list,index)=>{
const div = document.createElement("div")
div.className="list"
div.innerHTML=`
<div class="list-header">
<h3>${list.name}</h3>
<span class="delete" onclick="deleteList(${index})">🗑</span>
</div>
<input placeholder="Add task..." onkeydown="addTask(event,${index})">
<ul class="tasks">
${list.tasks.map((task,i)=>`
<li class="${task.completed ? "completed" : ""}">
<span onclick="toggleTask(${index},${i})">${task.text}</span>
<span class="delete" onclick="deleteTask(${index},${i})">❌</span>
</li>
`).join("")}
</ul>
`
listsContainer.appendChild(div)
})
}
createListBtn.addEventListener("click",createList)
listInput.addEventListener("keydown",(e)=>{
if(e.key==="Enter") createList()
})
function createList(){
const name = listInput.value.trim()
if(name==="") return
lists.push({
name:name,
tasks:[]
})
listInput.value=""
save()
render()
}
function deleteList(index){
lists.splice(index,1)
save()
render()
}
function addTask(event,listIndex){
if(event.key==="Enter"){
const text = event.target.value.trim()
if(text==="") return
lists[listIndex].tasks.push({
text:text,
completed:false
})
event.target.value=""
save()
render()
}
}
function toggleTask(listIndex,taskIndex){
let task = lists[listIndex].tasks[taskIndex]
task.completed = !task.completed
save()
render()
}
function deleteTask(listIndex,taskIndex){
lists[listIndex].tasks.splice(taskIndex,1)
save()
render()
}
themeToggle.addEventListener("click",()=>{
document.body.classList.toggle("dark")
localStorage.setItem("theme",document.body.classList.contains("dark"))
})
if(localStorage.getItem("theme")==="true"){
document.body.classList.add("dark")
}
render()