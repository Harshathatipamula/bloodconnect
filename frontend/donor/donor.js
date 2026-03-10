const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "donor") {
  window.location.href = "../auth/login.html";
}

document.getElementById("welcomeText").innerText =
  "Welcome, " + user.name;

function logout() {
  localStorage.clear();
  window.location.href = "../auth/login.html";
}
