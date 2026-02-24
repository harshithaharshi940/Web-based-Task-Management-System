const userId = localStorage.getItem("userId");
const badge = document.getElementById("notifCount");

if (!userId) {
  console.log("No user logged in");
  return;
}

if (!badge) {
  console.error("notifCount element NOT FOUND");
  return;
}

// Correct path (VERIFY this file exists)
const sound = new Audio("assets/notify.mp3");

// Fetch notifications
fetch(`http://localhost:3000/api/notifications/fetch?userId=${userId}`)
  .then(res => res.json())
  .then(data => {
    const unread = data.filter(n => n.is_read === 0).length;

    console.log("Unread notifications:", unread);

    if (unread > 0) {
      badge.textContent = unread;
      badge.style.display = "inline-block";

      // 🔔 Play sound ONLY ONCE per login
      if (!sessionStorage.getItem("notifRang") && window.userInteracted) {
        sound.play()
          .then(() => console.log("Notification sound played"))
          .catch(err => console.error("Sound blocked:", err));

        sessionStorage.setItem("notifRang", "true");
      }
    } else {
      badge.style.display = "none";
    }
  })
  .catch(err => console.error("Notification fetch error:", err));
