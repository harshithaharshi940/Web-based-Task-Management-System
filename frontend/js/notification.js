const userId = Number(localStorage.getItem("userId"));
const list = document.getElementById("notificationList");

/* 🔊 Notification sound */
const notifySound = new Audio("./assets/notification.mp3");

/* Ask browser permission (one time) */
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

/* Safety check */
if (!userId) {
  alert("Login required");
  window.location.href = "login.html";
}

/* Fetch notifications */
fetch(`http://localhost:3000/api/notifications/fetch?userId=${userId}`)
  .then(res => res.json())
  .then(data => {

    list.innerHTML = "";

    /* Get last seen count */
    const lastSeen = Number(localStorage.getItem("lastNotificationCount")) || 0;

    /* 🔔 If new notification arrived */
    if (data.length > lastSeen) {

      /* 🔊 Play sound (after user interaction) */
      notifySound.play().catch(() => {
        // browser may block autoplay until user clicks
      });

      /* 🔔 Browser popup */
      if (Notification.permission === "granted") {
        new Notification("Aakruthi 3D - New Notification", {
          body: data[0].message,
          icon: "./logo.png"
        });
      }
    }

    /* Save current count */
    localStorage.setItem("lastNotificationCount", data.length);

    /* No notifications */
    if (data.length === 0) {
      list.innerHTML = "<li>No notifications</li>";
      return;
    }

    /* Render notifications */
    data.forEach(n => {
      const li = document.createElement("li");
      li.textContent = n.message;
      li.className = n.is_read ? "read" : "unread";
      list.appendChild(li);
    });
  })
  .catch(err => console.error("Notification error:", err));

/* Mark all notifications as read */
fetch("http://localhost:3000/api/notifications/read", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId })
});

// Mark as read ONLY when notification page is opened
window.addEventListener("load", () => {
  fetch("http://localhost:3000/api/notifications/read", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  // Reset unread counter locally
  localStorage.setItem("lastUnreadCount", 0);
});

/* Logout */
function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "login.html";
}
