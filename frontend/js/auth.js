function login() {
  console.log("Login clicked");

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("error");

  errorEl.innerText = "";

  if (!username || !password) {
    errorEl.innerText = "Please enter username and password";
    return;
  }

  fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Login response:", data);

      if (data.success) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);

        // ✅ REDIRECT
        window.location.href = "dashboard.html";
      } else {
        errorEl.innerText = "Invalid username or password";
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      errorEl.innerText = "Server error";
    });
}
