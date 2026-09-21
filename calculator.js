
"use strict";

let projectileChart = null;

const form = document.getElementById("calculator-form");

form.addEventListener("submit", function (event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get values entered by the user
    const velocity =
        parseFloat(document.getElementById("velocity").value);

    const angle =
        parseFloat(document.getElementById("angle").value);

    const startingHeight =
        parseFloat(document.getElementById("height").value);

    const gravity =
        parseFloat(document.getElementById("gravity").value);

    const startX =
        parseFloat(document.getElementById("startX").value);

    const endX =
        parseFloat(document.getElementById("endX").value);

    const step =
        parseFloat(document.getElementById("step").value);

    const errorMessage =
        document.getElementById("error-message");

    errorMessage.textContent = "";

    // Basic validation
    if (
        velocity <= 0 ||
        angle <= 0 ||
        angle >= 90 ||
        gravity <= 0 ||
        step <= 0 ||
        endX <= startX
    ) {
        errorMessage.textContent =
            "Please enter valid numbers. The ending X value must be greater than the starting X value.";
        return;
    }

    // Convert degrees to radians
    const radians = angle * (Math.PI / 180);

    const points = [];

    let maxHeight = startingHeight;
    let range = startX;

    // Calculate the projectile height for each X value
    for (let x = startX; x <= endX; x += step) {

        const y =
            startingHeight +
            x * Math.tan(radians) -
            (
                gravity * Math.pow(x, 2)
            ) /
            (
                2 *
                Math.pow(velocity, 2) *
                Math.pow(Math.cos(radians), 2)
            );

        // Stop plotting once the projectile goes underground
        if (y < 0 && x > startX) {
            break;
        }

        points.push({
            x: x,
            y: y
        });

        if (y > maxHeight) {
            maxHeight = y;
        }

        range = x;
    }

    // Display calculated results
    document.getElementById("maxHeight").textContent =
        maxHeight.toFixed(2);

    document.getElementById("range").textContent =
        range.toFixed(2);

    createChart(points);
});


function createChart(points) {

    const canvas =
        document.getElementById("projectileChart");

    const context = canvas.getContext("2d");

    // Remove the previous graph before creating a new one
    if (projectileChart !== null) {
        projectileChart.destroy();
    }

    projectileChart = new Chart(context, {

        type: "line",

        data: {
            datasets: [{
                label: "Projectile Path",
                data: points,
                borderWidth: 3,
                pointRadius: 2,
                tension: 0.2
            }]
        },

        options: {

            responsive: true,

            parsing: false,

            scales: {

                x: {
                    type: "linear",
                    position: "bottom",

                    title: {
                        display: true,
                        text: "Horizontal Distance (meters)"
                    }
                },

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,
                        text: "Height (meters)"
                    }
                }
            },

            plugins: {

                title: {
                    display: true,
                    text: "Projectile Motion"
                },

                legend: {
                    display: true
                }
            }
        }
    });
}

