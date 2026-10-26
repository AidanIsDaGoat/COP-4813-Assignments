
"use strict";

const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("animationMessage");

const ball = {
    x: 70,
    y: 70,
    radius: 22,
    dx: 3,
    dy: 2.5,
    color: "#00e5ff"
};

const colors = [
    "#00e5ff",
    "#ff4081",
    "#76ff03",
    "#ffea00",
    "#b388ff",
    "#ff9100"
];

let colorIndex = 0;
let particles = [];

// Draw the ball with a glowing effect
function drawBall() {
    ctx.save();

    ctx.shadowBlur = 22;
    ctx.shadowColor = ball.color;
    ctx.fillStyle = ball.color;

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Highlight on the ball
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(
        ball.x - 7,
        ball.y - 7,
        ball.radius * 0.28,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}

// Move the ball and bounce off the boundaries
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius >= canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.dx = -Math.abs(ball.dx);
    }

    if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
    }

    if (ball.y + ball.radius >= canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = -Math.abs(ball.dy);
    }

    if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
    }
}

// Create particles when the ball is clicked
function createExplosion() {
    for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;

        particles.push({
            x: ball.x,
            y: ball.y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            radius: 2 + Math.random() * 4,
            color: ball.color,
            life: 35
        });
    }
}

// Draw and update explosion particles
function updateParticles() {
    particles = particles.filter(function (particle) {
        return particle.life > 0;
    });

    for (const particle of particles) {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life--;

        ctx.globalAlpha = particle.life / 35;
        ctx.fillStyle = particle.color;

        ctx.beginPath();
        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveBall();
    updateParticles();
    drawBall();

    requestAnimationFrame(animate);
}

// Respond to mouse clicks on the ball
canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();

    // Convert screen coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const distance = Math.hypot(
        mouseX - ball.x,
        mouseY - ball.y
    );

    if (distance <= ball.radius) {
        createExplosion();

        // Change the ball's color
        colorIndex = (colorIndex + 1) % colors.length;
        ball.color = colors[colorIndex];

        // Reverse its direction
        ball.dx *= -1;
        ball.dy *= -1;

        message.textContent =
            "Great shot! The ball changed color and direction.";
    }
});

// Start the animation
animate();
