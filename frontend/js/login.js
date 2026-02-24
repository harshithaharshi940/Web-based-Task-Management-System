function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  message.style.color = "red";
  message.innerText = "";

  if (!username || !password) {
    message.innerText = "Please enter username and password";
    return;
  }

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        message.innerText = data.message;
        return;
      }

      // SUCCESS
      localStorage.setItem("user", JSON.stringify(data));

      message.style.color = "green";
      message.innerText = "Login successful";

      // Redirect after short delay (UX friendly)
     setTimeout(() => {
  window.location.href = "./dashboard.html";
}, 500);

    })
    .catch(() => {
      message.innerText = "Server error. Please try again.";
    });
}
