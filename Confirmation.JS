```javascript
"use strict";

const details = document.getElementById("confirmation-details");
const confirmButton = document.getElementById("confirm-button");
const editButton = document.getElementById("edit-button");

const savedData = sessionStorage.getItem("formData");

if (!savedData) {

    details.innerHTML =
        "<p>No form information was found. " +
        "Please return to the form.</p>";

    confirmButton.disabled = true;

} else {

    const data = JSON.parse(savedData);

    const birthDate = new Date(
        data.birthdate + "T00:00:00"
    );

    const formattedBirthDate =
        birthDate.toLocaleDateString();

    details.innerHTML = `
        <dl class="confirmation-list">

            <dt>First Name</dt>
            <dd>${escapeHTML(data.firstName)}</dd>

            <dt>Last Name</dt>
            <dd>${escapeHTML(data.lastName)}</dd>

            <dt>Address</dt>
            <dd>${escapeHTML(data.address)}</dd>

            <dt>City</dt>
            <dd>${escapeHTML(data.city)}</dd>

            <dt>State</dt>
            <dd>${escapeHTML(data.state)}</dd>

            <dt>ZIP Code</dt>
            <dd>${escapeHTML(data.zip)}</dd>

            <dt>Phone Number</dt>
            <dd>${escapeHTML(data.phone)}</dd>

            <dt>Email Address</dt>
            <dd>${escapeHTML(data.email)}</dd>

            <dt>Birth Date</dt>
            <dd>${escapeHTML(formattedBirthDate)}</dd>

            <dt>Message</dt>
            <dd>${escapeHTML(data.message)}</dd>

        </dl>
    `;
}


/* Return to form */

editButton.addEventListener("click", function () {
    window.location.href = "form.html";
});


/* Confirm and send email */

confirmButton.addEventListener("click", function () {

    const data = JSON.parse(
        sessionStorage.getItem("formData")
    );

    const recipient = "YOUR-EMAIL@example.com";

    const subject =
        "COP4813 Information Form Submission";

    const body =
        "Name: " +
        data.firstName + " " +
        data.lastName + "\n\n" +

        "Address: " +
        data.address + ", " +
        data.city + ", " +
        data.state + " " +
        data.zip + "\n\n" +

        "Phone: " +
        data.phone + "\n\n" +

        "Email: " +
        data.email + "\n\n" +

        "Birth Date: " +
        data.birthdate + "\n\n" +

        "Message:\n" +
        data.message;

    const mailto =
        "mailto:" +
        recipient +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

    window.location.href = mailto;
});


/* Prevent user-entered HTML from being interpreted */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```
