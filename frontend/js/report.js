const container = document.getElementById("taskReports");
let taskData = [];

fetch("http://localhost:3000/api/tasks/fetch")
  .then(res => res.json())
  .then(tasks => {
    taskData = tasks;
    renderReports(tasks);
  });

function renderReports(tasks) {
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
      <h3>${task.title}</h3>

      <div class="task-details">
        <div><strong>Assigned To:</strong> ${task.assigned_to_name || "-"}</div>
        <div><strong>Assigned By:</strong> ${task.created_by_name || "-"}</div>
        <div><strong>Priority:</strong> ${task.priority}</div>
        <div><strong>Deadline:</strong> ${task.deadline?.split("T")[0]}</div>
        <div>
          <strong>Status:</strong>
          <span class="status ${task.status.replace(" ", "")}">
            ${task.status}
          </span>
        </div>
      </div>

      <div style="margin-top:15px;">
        <button onclick="exportSingleTask(${index})">
          Export PDF
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

/* EXPORT SINGLE TASK PDF */
function exportSingleTask(index) {
  const task = taskData[index];
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const primaryColor = [11, 15, 74]; // Aakruthi blue
  const lightGray = [245, 246, 249];

  /* HEADER BACKGROUND */
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 35, "F");

  /* LOGO */
  const logo = new Image();
  logo.src = "assets/logo.png";

  doc.addImage(logo, "PNG", 14, 7, 18, 18);

  /* COMPANY NAME */
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("Aakruthi 3D Private Limited", 40, 17);

  doc.setFontSize(11);
  doc.text("Individual Task Report", 40, 25);

  /* CONTENT BOX */
  let y = 50;
  doc.setTextColor(0, 0, 0);

  doc.setFillColor(...lightGray);
  doc.roundedRect(12, y - 8, 186, 85, 5, 5, "F");

  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text("Task Information", 16, y);

  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  /* DETAILS */
  doc.text(`Task Title:`, 16, y);
  doc.text(task.title, 55, y);

  y += 8;
  doc.text(`Assigned To:`, 16, y);
  doc.text(task.assigned_to_name || "-", 55, y);

  doc.text(`Assigned By:`, 115, y);
  doc.text(task.created_by_name || "-", 150, y);

  y += 8;
  doc.text(`Priority:`, 16, y);
  doc.text(task.priority, 55, y);

  doc.text(`Deadline:`, 115, y);
  doc.text(task.deadline?.split("T")[0], 150, y);

  y += 8;
  doc.text(`Status:`, 16, y);
  doc.text(task.status, 55, y);

  /* FOOTER */
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    14,
    285
  );

  doc.text("Aakruthi 3D Pvt Ltd • Internal Use Only", 120, 285);

  /* SAVE */
  const safeTitle = task.title.replace(/\s+/g, "_");
  doc.save(`Aakruthi3D_TaskReport_${safeTitle}.pdf`);
}


/* LOGOUT */
function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "login.html";
}
