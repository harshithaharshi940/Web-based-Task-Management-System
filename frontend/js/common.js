function checkLogin() {
  const role = localStorage.getItem("role");
  if (!role) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function applyRoleBasedNavbar() {
  const role = localStorage.getItem("role");

  if (role === "Intern") {
    const assignNav = document.getElementById("nav-assign");
    if (assignNav) assignNav.style.display = "none";
  }
}

const user = JSON.parse(localStorage.getItem("user"));

fetch(`http://localhost:3000/api/notifications/count?userId=${user.id}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("notifCount").innerText = data.count;
  });
