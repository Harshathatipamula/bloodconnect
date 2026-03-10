const form = document.getElementById("donationForm");
const confirmSection = document.getElementById("confirmSection");
const confirmBtn = document.getElementById("confirmBtn");

let currentDonationId = null;
let currentAmount = null;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const donorName = document.getElementById("donorName").value;
    const amount = document.getElementById("amount").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!donorName || !amount || !paymentMethod) {
        alert("All fields required");
        return;
    }

    try {
        // 1️⃣ CREATE DONATION IN DATABASE
        const response = await fetch("http://localhost:5000/api/donations/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                donor_name: donorName,
                amount: amount,
                payment_method: paymentMethod
            })
        });

        const data = await response.json();

        if (!data.success) {
            alert("Error creating donation");
            return;
        }

        currentDonationId = data.donationId;
        currentAmount = amount;

        // 2️⃣ OPEN UPI APP
        const upiLink = `upi://pay?pa=${data.upiId}&pn=BloodConnect&am=${amount}&cu=INR`;
        window.location.href = upiLink;

        // Show confirm button after redirect
        confirmSection.style.display = "block";

    } catch (error) {
        console.error(error);
        alert("Server error");
    }
});


confirmBtn.addEventListener("click", async () => {
    if (!currentDonationId) {
        alert("No donation found");
        return;
    }

    try {
        // 3️⃣ CONFIRM DONATION
        await fetch(`http://localhost:5000/api/donations/confirm/${currentDonationId}`, {
            method: "PATCH"
        });

        alert("🎉 Thank you for your donation!");

        confirmSection.style.display = "none";
        form.reset();

    } catch (error) {
        console.error(error);
        alert("Confirmation failed");
    }
});
