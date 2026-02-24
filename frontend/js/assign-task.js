const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

// ❌ Intern should not access this page
if (role === "Intern") {
  alert("You are not allowed to assign tasks");
  window.location.href = "dashboard.html";
}

// Set minimum date = today
document.getElementById("deadline").min =
  new Date().toISOString().split("T")[0];

/* ================================
   ASSIGN TO USERS (EXISTING LOGIC)
   ================================ */
fetch(`http://localhost:3000/api/tasks/assignable-users?role=${role}`)
  .then(res => res.json())
  .then(users => {
    populateAssignToUsers(users);
    loadReportToUsers(); // ✅ ONLY NEW LINE ADDED
  })
  .catch(err => console.error(err));

/* Populate ASSIGN TO dropdown (UNCHANGED BEHAVIOR) */
function populateAssignToUsers(users) {
  const assignedTo = document.getElementById("assignedTo");
  assignedTo.innerHTML = "<option value=''>Select</option>";

  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.username} (${user.role})`;
    assignedTo.appendChild(option);
  });
}

/* ================================
   REPORT TO USERS (NEW & SEPARATE)
   ================================ */
function loadReportToUsers() {
  fetch("http://localhost:3000/api/users/report-to-users")
    .then(res => res.json())
    .then(users => {
      const reportTo = document.getElementById("reportTo");
      reportTo.innerHTML = "<option value=''>Select</option>";

      users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = `${user.username} (${user.role})`;
        reportTo.appendChild(option);
      });
    })
    .catch(err => console.error("Report To load error:", err));
}

/* ================================
   SUBMIT TASK (UNCHANGED)
   ================================ */
document.getElementById("taskForm").addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    title: title.value,
    description: description.value,
    priority: priority.value,
    deadline: deadline.value,
    assigned_to: assignedTo.value,
    report_to: reportTo.value,
    attachment: attachment.value,
    created_by: userId,
    creator_role: role
  };

  fetch("http://localhost:3000/api/tasks/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("Task assigned successfully");
        document.getElementById("taskForm").reset();
      } else {
        alert("Failed to assign task");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
});

/* ================================
   LOGOUT (UNCHANGED)
   ================================ */
function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "login.html";
}