// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Login failed");
        return;
      }

      if (!data || !data.token || !data.user) {
        alert("Backend did not return complete user data.");
        return;
      }

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Always redirect to home page
      window.location.href = "../home/home.html";

    } catch (error) {
      console.error("Login error:", error);
      alert("Server error during login");
    }
  });
}


// =====================================
// SIGNUP
// =====================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
   

    const phoneInput = document.getElementById("phone");
    const phone = phoneInput ? phoneInput.value.trim() : null;

    if (!name || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Signup failed");
        return;
      }

      alert("Account created successfully!");
      window.location.href = "login.html";

    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error during signup");
    }
  });
}
