const form = document.getElementById("profileForm");
const registerMsg = document.getElementById("registerMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    showMessage("Please login first", "red");
    return;
  }

  // Collect values
  const full_name = document.getElementById("fullName").value.trim();
  const dob = document.getElementById("dob").value;
  const address = document.getElementById("address").value.trim();
  const pincode = document.getElementById("pincode").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const area = document.getElementById("area").value.trim();
  const blood_group = document.getElementById("bloodGroup").value;
  const gender = document.getElementById("gender").value;

  // Basic validation
  if (
    !full_name ||
    !dob ||
    !address ||
    !pincode ||
    !phone ||
    !area ||
    !blood_group ||
    !gender
  ) {
    showMessage("All fields are required", "red");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/donor/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        full_name,
        dob,
        address,
        pincode,
        phone,
        area,
        blood_group,
        gender
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showMessage(data.message || "Database error", "red");
      return;
    }

    // ✅ Success
    showMessage("DONOR registered successfully", "green");

    // Optional: reset form after success
    form.reset();

  } catch (err) {
    console.error("Profile Submit Error:", err);
    showMessage("Server error. Try again.", "red");
  }
});


/* ================= HELPER FUNCTION ================= */

function showMessage(message, color) {
  registerMsg.textContent = message;
  registerMsg.style.color = color;
  registerMsg.classList.add("show");

  // Auto hide after 4 seconds
  setTimeout(() => {
    registerMsg.classList.remove("show");
  }, 4000);
}
