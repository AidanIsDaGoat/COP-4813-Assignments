"use strict";

let projectileChart;

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("calculator-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        calculateProjectile();
    });

    // Calculate automatically when page loads
    calculateProjectile();
});

function calculateProjectile() {

    const velocity = Number(document.getElementById("velocity").value);
    const angle = Number(document.getElementById("angle").value);
    const startingHeight = Number(document.getElementById("height").value);
    const gravity = Number(document.getElementById("gravity").value);
    const startX = Number(document.getElementById("startX").value);
    const endX = Number(document.getElementById("endX").value);
    const step = Number(document.getElementById("step").value);

    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    if (
        velocity <= 0 ||
        angle <= 0 ||
        angle >= 90 ||
        gravity <= 0 ||
        step <= 0 ||
        endX <= startX
    ) {
        errorMessage.textContent = "Please enter valid numbers.";
        return;
    }

    // Convert angle from degrees to radians
    const radians = angle * Math.PI / 180;

    const points = [];

    let maxHeight = startingHeight;
    let range = startX;

    for (let x = startX; x <= endX; x += step) {

        const y =
            startingHeight +
            x * Math.tan(radians) -
            (gravity * x * x) /
            (
                2 *
                velocity * velocity *
                Math.pow(Math.cos(radians), 2)
            );

        // Stop after projectile reaches the ground
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

    // Display results
    document.getElementById("maxHeight").textContent =
        maxHeight.toFixed(2);

    document.getElementById("range").textContent =
        range.toFixed(2);

    drawChart(points);
}

function drawChart(points) {

    const canvas = document.getElementById("projectileChart");

    if (!canvas) {
        console.error("projectileChart canvas was not found.");
        return;
    }

    if (typeof Chart === "undefined") {
        console.error("Chart.js did not load.");
        document.getElementById("error-message").textContent =
            "Chart.js did not load.";
        return;
    }

    if (projectileChart) {
        projectileChart.destroy();
    }

    projectileChart = new Chart(canvas, {
        type: "line",

        data: {
            datasets: [{
                label: "Projectile Path",
                data: points,
                borderWidth: 3,
                pointRadius: 2
            }]
        },

        options: {
            responsive: true,

            parsing: false,

            scales: {
                x: {
                    type: "linear",
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
            }
        }
    });
}
