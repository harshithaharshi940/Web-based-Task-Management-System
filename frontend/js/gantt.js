const ganttContainer = document.getElementById("ganttContainer");
const tableBody = document.getElementById("taskTable");

const pendingCount = document.getElementById("pendingCount");
const progressCount = document.getElementById("progressCount");
const completedCount = document.getElementById("completedCount");

fetch("http://localhost:3000/api/tasks/fetch")
  .then(res => res.json())
  .then(tasks => {
    renderSummary(tasks);
    renderTable(tasks);
    renderGantt(tasks);
  });

/* SUMMARY */
function renderSummary(tasks) {
  pendingCount.textContent = tasks.filter(t => t.status === "Pending").length;
  progressCount.textContent = tasks.filter(t => t.status === "In Progress").length;
  completedCount.textContent = tasks.filter(t => t.status === "Completed").length;
}

/* TABLE */
function renderTable(tasks) {
  tableBody.innerHTML = "";

  tasks.forEach(task => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.assigned_to_name || "-"}</td>
      <td>${task.priority}</td>
      <td>${task.deadline.split("T")[0]}</td>
      <td>${task.status}</td>
    `;
    tableBody.appendChild(row);
  });
}

/* GANTT */
function renderGantt(tasks) {
  ganttContainer.innerHTML = "";
  const today = new Date();

  tasks.forEach(task => {
    const deadline = new Date(task.deadline);
    const days = Math.max(
      1,
      Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    );

    const width = Math.min(days * 30, 600);

    let barClass = "pending-bar";
    if (task.status === "In Progress") barClass = "progress-bar";
    if (task.status === "Completed") barClass = "completed-bar";

    const row = document.createElement("div");
    row.className = "gantt-row";
    row.innerHTML = `
      <div class="gantt-task">${task.title}</div>
      <div class="gantt-bar-wrapper">
        <div class="gantt-bar ${barClass}" style="width:${width}px">
          ${task.status}
        </div>
      </div>
    `;

    ganttContainer.appendChild(row);
  });
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "login.html";
}
