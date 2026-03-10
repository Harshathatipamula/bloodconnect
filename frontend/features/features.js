const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.2 });

reveals.forEach(el => observer.observe(el));

function navigateToDonor() {
    window.location.href = "../auth/signup.html";
}

function findBloodBanks() {
    alert("Blood bank location feature coming next phase.");
}

function contactNearby() {
    alert("Emergency contact feature coming next phase.");
}

function navigateToDonor() {
    window.location.href = "../donor/profile.html";
}