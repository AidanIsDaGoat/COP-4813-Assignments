
"use strict";

// Get the canvas and drawing context
const canvas = document.getElementById("spirographCanvas");
const ctx = canvas.getContext("2d");

const drawButton = document.getElementById("drawButton");
const errorMessage = document.getElementById("spirographError");

let animationID;

// Start drawing when the button is clicked
drawButton.addEventListener("click", function () {

    // Get the user's values
    const R = Number(document.getElementById("outerRadius").value);
    const r = Number(document.getElementById("innerRadius").value);
    const O = Number(document.getElementById("offset").value);

    errorMessage.textContent = "";

    // Validate R
    if (R < 50 || R > 150) {
        errorMessage.textContent =
            "Outer Radius (R) must be between 50 and 150.";
        return;
    }

    // Validate r
    if (r < 10 || r > 75) {
        errorMessage.textContent =
            "Inner Radius (r) must be between 10 and 75.";
        return;
    }

    // Validate O
    if (O < 0 || O > 75) {
        errorMessage.textContent =
            "Pen Offset (O) must be between 0 and 75.";
        return;
    }

    // Inner radius should be smaller than outer radius
    if (r >= R) {
        errorMessage.textContent =
            "The inner radius must be smaller than the outer radius.";
        return;
    }

    drawSpirograph(R, r, O);
});


function drawSpirograph(R, r, O) {

    // Stop an old animation if the button is clicked again
    cancelAnimationFrame(animationID);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Starting value for t
    let t = 0;

    // Controls how quickly the pen moves
    const increment = 0.02;

    // Maximum amount to draw
    const maxT = Math.PI * 40;

    // Calculate the first point
    let previousX =
        (R + r) * Math.cos(t) -
        (r + O) * Math.cos(((R + r) / r) * t);

    let previousY =
        (R + r) * Math.sin(t) -
        (r + O) * Math.sin(((R + r) / r) * t);

    // Move starting point to center of canvas
    previousX += centerX;
    previousY += centerY;

    ctx.beginPath();
    ctx.moveTo(previousX, previousY);

    function animate() {

        // Draw several points during each animation frame
        for (let i = 0; i < 10; i++) {

            t += increment;

            // Spirograph X equation
            const x =
                (R + r) * Math.cos(t) -
                (r + O) *
                Math.cos(((R + r) / r) * t);

            // Spirograph Y equation
            const y =
                (R + r) * Math.sin(t) -
                (r + O) *
                Math.sin(((R + r) / r) * t);

            // Move coordinates to center of canvas
            const canvasX = centerX + x;
            const canvasY = centerY + y;

            // Extend the previous line
            ctx.lineTo(canvasX, canvasY);

            // Draw the new section
            ctx.stroke();

            if (t >= maxT) {
                return;
            }
        }

        // Continue drawing
        animationID = requestAnimationFrame(animate);
    }

    animate();
}
