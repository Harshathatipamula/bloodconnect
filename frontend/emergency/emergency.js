async function searchDonors() {

    const pincode = document.getElementById("pincode").value.trim();
    const bloodGroup = document.getElementById("bloodGroup").value.trim();

    const response = await fetch("http://localhost:5000/api/donor/search-donors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pincode: pincode,
            blood_group: bloodGroup
        })
    });

    const data = await response.json();

    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    if (!data.donors || data.donors.length === 0) {
        resultDiv.innerHTML = "<p>No donors found.</p>";
        return;
    }

    data.donors.forEach(donor => {
        resultDiv.innerHTML += `
            <div class="donor-card">
                <h3>${donor.full_name}</h3>
                <p>Blood Group: ${donor.blood_group}</p>
                <p>
                    Phone: 
                    <span class="phone-copy" onclick="copyPhone('${donor.phone}')">
                        ${donor.phone}
                    </span>
                </p>
            </div>
        `;
    });
}

function copyPhone(phone) {
    navigator.clipboard.writeText(phone);
    alert("Phone number copied!");
}
