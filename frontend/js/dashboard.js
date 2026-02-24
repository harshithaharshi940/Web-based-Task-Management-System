const userId = Number(localStorage.getItem("userId"));
const role = localStorage.getItem("role");

const assignedToBody = document.getElementById("assignedToMe");
const assignedFromBody = document.getElementById("assignedFromMe");

const assignedToCard = document.getElementById("assignedToCard");
const assignedFromCard = document.getElementById("assignedFromCard");

/* ---------- ROLE BASED CARD VISIBILITY ---------- */
if (role === "Admin") {
  assignedToCard.style.display = "none";
}

if (role === "Intern") {
  assignedFromCard.style.display = "none";
}

/* ---------- LOAD DASHBOARD ---------- */
loadDashboard();

function loadDashboard() {
  fetch("http://localhost:3000/api/tasks/fetch")
    .then(res => res.json())
    .then(tasks => renderDashboard(tasks))
    .catch(err => console.error(err));
}

/* ---------- RENDER ---------- */
function renderDashboard(tasks) {
  assignedToBody.innerHTML = "";
  assignedFromBody.innerHTML = "";

  tasks.forEach(task => {

    /* ===== TASKS ASSIGNED TO ME ===== */
    if (task.assigned_to === userId && role !== "Admin") {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.priority}</td>
        <td>${task.deadline.split("T")[0]}</td>
        <td>${task.status}</td>
        <td>
          <select onchange="updateStatus(${task.id}, this.value)">
            <option ${task.status === "Pending" ? "selected" : ""}>Pending</option>
            <option ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option ${task.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
      `;
      assignedToBody.appendChild(row);
    }

    /* ===== TASKS ASSIGNED FROM ME ===== */
    if (task.created_by === userId && role !== "Intern") {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.assigned_to_name || "-"}</td>
        <td>${task.deadline.split("T")[0]}</td>
        <td>${task.status}</td>
        <td>
          <button onclick="deleteTask(${task.id})">Delete</button>
        </td>
      `;
      assignedFromBody.appendChild(row);
    }
  });
}

/* ---------- UPDATE STATUS ---------- */
function updateStatus(taskId, status) {
  fetch("http://localhost:3000/api/tasks/update-status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId, status })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) loadDashboard();
    });
}

/* ---------- DELETE TASK ---------- */
function deleteTask(taskId) {
  if (!confirm("Delete this task?")) return;

  fetch("http://localhost:3000/api/tasks/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId, userId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) loadDashboard();
      else alert("Not allowed");
    });
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "login.html";
}