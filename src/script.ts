// ENUM
enum Status {
  Pending = "Pending",
  Completed = "Completed"
}

// TYPE
type TaskID = number;

// INTERFACE
interface Task {
  id: TaskID;
  text: string;
  time: string;
  completed: boolean;
}

// GENERIC STORAGE
class AppStorage<T> {
  constructor(private key: string) {}

  save(data: T): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  load(): T {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : ([] as unknown as T);
  }
}

// DOM
const input = document.getElementById("taskInput") as HTMLInputElement;
const timeInput = document.getElementById("taskTime") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const list = document.getElementById("taskList") as HTMLUListElement;
const themeBtn = document.getElementById("themeToggle") as HTMLButtonElement;

// STATE
const storage = new AppStorage<Task[]>("tasks");
let tasks: Task[] = storage.load();

// SAVE + RENDER
function render(): void {
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

    li.querySelector(".delete")!.addEventListener("click", (e) => {
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

  if (!text || !time) return;

  const newTask: Task = {
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