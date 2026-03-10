document.addEventListener("DOMContentLoaded", () => {

  console.log("Home JS Loaded Successfully");

  /* ======================================================
     ELEMENT REFERENCES
  ====================================================== */
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  const logoutBtn = document.getElementById("logoutBtn");
  const menuLinks = document.querySelectorAll(".pill-link");
  const sideClose = document.getElementById("sideClose");
  const mainContent = document.getElementById("mainContent");


  if (!hamburger || !sideMenu || !overlay) {
    console.warn("Navigation elements missing in HTML.");
    return;
  }

  /* ======================================================
     MENU CONTROL
  ====================================================== */

 function openMenu() {
  hamburger.classList.add("active");
  sideMenu.classList.add("active");
  overlay.classList.add("active");
  document.getElementById("mainContent").classList.add("blur-active");
  document.body.style.overflow = "hidden";
}


 function closeMenu() {
  hamburger.classList.remove("active");
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
  document.getElementById("mainContent").classList.remove("blur-active");
  document.body.style.overflow = "";
}


  function toggleMenu() {
    sideMenu.classList.contains("active") ? closeMenu() : openMenu();
  }

  hamburger.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);
  if (sideClose) {
  sideClose.addEventListener("click", closeMenu);
}


  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  // Close menu when clicking any link
  menuLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  /* ======================================================
   SCROLL REVEAL (Repeatable)
====================================================== */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    } else {
      entry.target.classList.remove("active");
    }

  });
}, {
  threshold: 0.2
});

revealElements.forEach(el => {
  revealObserver.observe(el);
});



/* =========================================
   TRUST SECTION HORIZONTAL REVEAL
========================================= */

const trustRevealElements = document.querySelectorAll(".reveal-left, .reveal-right");

const trustObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    } else {
      entry.target.classList.remove("active");
    }

  });
}, {
  threshold: 0.3
});

trustRevealElements.forEach(el => trustObserver.observe(el));

  /* ======================================================
     LOGOUT HANDLER
  ====================================================== */

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (err) {
        console.error("Error clearing storage:", err);
      }

      window.location.href = "../auth/login.html";
    });
  }

});



async function loadGoogleUsersCount() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/google-users-count");
    const data = await response.json();

    if (data.success) {
      const countUp = new CountUp("usersCount", data.total, {
        duration: 2,
        separator: ","
      });

      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }

  } catch (error) {
    console.error("Error fetching users count:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadGoogleUsersCount);
