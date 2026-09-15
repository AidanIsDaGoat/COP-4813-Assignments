
"use strict";

const form = document.getElementById("information-form");
const phoneInput = document.getElementById("phone");
const errorBox = document.getElementById("form-errors");

/* Format phone number as (000) 000-0000 */
phoneInput.addEventListener("input", function () {
    let numbers = phoneInput.value.replace(/\D/g, "");

    if (numbers.length > 10) {
        numbers = numbers.substring(0, 10);
    }

    if (numbers.length >= 7) {
        phoneInput.value =
            "(" +
            numbers.substring(0, 3) +
            ") " +
            numbers.substring(3, 6) +
            "-" +
            numbers.substring(6);
    } else if (numbers.length >= 4) {
        phoneInput.value =
            "(" +
            numbers.substring(0, 3) +
            ") " +
            numbers.substring(3);
    } else if (numbers.length > 0) {
        phoneInput.value = "(" + numbers;
    } else {
        phoneInput.value = "";
    }
});


form.addEventListener("submit", function (event) {

    event.preventDefault();

    const errors = [];

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birthdate").value;
    const message = document.getElementById("message").value.trim();
    const securityAnswer =
        document.getElementById("security-question").value.trim();

    /* Name validation */

    const namePattern = /^[A-Za-zÀ-ÿ'-]+$/;

    if (firstName === "" || !namePattern.test(firstName)) {
        errors.push("Please enter a valid first name.");
    }

    if (lastName === "" || !namePattern.test(lastName)) {
        errors.push("Please enter a valid last name.");
    }


    /* Address validation */

    const addressPattern = /^\d+\s+[A-Za-z0-9\s.'#-]+$/;

    if (address === "" || !addressPattern.test(address)) {
        errors.push(
            "Please enter a valid street address with a street number."
        );
    }

    if (city === "" || !/^[A-Za-zÀ-ÿ\s.'-]+$/.test(city)) {
        errors.push("Please enter a valid city.");
    }

    if (state === "") {
        errors.push("Please select a state.");
    }

    const zipPattern = /^\d{5}(-\d{4})?$/;

    if (!zipPattern.test(zip)) {
        errors.push(
            "Please enter a valid 5-digit ZIP code or ZIP+4."
        );
    }


    /* Phone validation */

    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (!phonePattern.test(phone)) {
        errors.push(
            "Please enter a complete 10-digit phone number in the format (000) 000-0000."
        );
    }


    /* Email validation */

    const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailPattern.test(email)) {
        errors.push("Please enter a valid email address.");
    }


    /* Birth date validation */

    if (birthdate === "") {

        errors.push("Please enter your birth date.");

    } else {

        const selectedDate = new Date(birthdate + "T00:00:00");
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(selectedDate.getTime())) {

            errors.push("Please enter a valid birth date.");

        } else if (selectedDate > today) {

            errors.push("Birth date cannot be in the future.");

        }
    }


    /* Message validation */

    if (message === "") {
        errors.push("Please enter a message.");
    }


    /* Security question */

    if (securityAnswer !== "12") {
        errors.push("The security question answer is incorrect.");
    }


    /* Display errors */

    if (errors.length > 0) {

        errorBox.innerHTML =
            "<strong>Please correct the following:</strong><ul>" +
            errors.map(function (error) {
                return "<li>" + error + "</li>";
            }).join("") +
            "</ul>";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }


    /* Save information for confirmation page */

    const formData = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        state: state,
        zip: zip,
        phone: phone,
        email: email,
        birthdate: birthdate,
        message: message
    };

    sessionStorage.setItem(
        "formData",
        JSON.stringify(formData)
    );

    window.location.href = "confirmation.html";
});
```
