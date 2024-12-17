const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const themeButton = document.getElementById('themeButton');

const dinoImg = new Image();
dinoImg.src = 'dino.png';

const cactusImg = new Image();
cactusImg.src = 'cactus.png';

let dino = { x: 50, y: 206, width: 88, height: 94, dy: 0, gravity: 1.1, jumpStrength: -20 };
let obstacles = [];
let isJumping = false;
let score = 0;
let gameOver = false;
let gameStarted = false;
let darkTheme = false;
let obstacleTimer = 0;
let obstacleInterval = 100;
let gameSpeed = 10;

const dinoRunFrames = [0, 1]; // Adjust if more frames are available
let currentFrame = 0;
let frameCounter = 0;
const frameInterval = 5; // Change frames every 5 updates

dinoImg.onload = () => {
    console.log('Dino image loaded');
    gameLoop(); // Start the game loop after the image is loaded
};

cactusImg.onload = () => {
    console.log('Cactus image loaded');
};

function resetGame() {
    dino.y = 206;
    dino.dy = 0;
    obstacles = [];
    score = 0;
    gameOver = false;
    obstacleTimer = 0;
    gameSpeed = 10;
}

function update() {
    if (!gameStarted || gameOver) return;

    // Dino jump logic
    if (isJumping) {
        dino.dy = dino.jumpStrength;
        isJumping = false;
    }
    dino.dy += dino.gravity;
    dino.y += dino.dy;

    // Prevent dino from falling through the ground
    if (dino.y > 206) {
        dino.y = 206;
        dino.dy = 0;
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    // Add new obstacles
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
        obstacles.push({ x: canvas.width, y: 206, width: 40, height: 80 });
        obstacleTimer = 0;
    }

    // Increase game speed every 10 points
    if (score > 0 && score % 10 === 0) {
        gameSpeed += 0.2;
    }

    // Update running animation
    frameCounter++;
    if (frameCounter >= frameInterval) {
        currentFrame = (currentFrame + 1) % dinoRunFrames.length;
        frameCounter = 0;
    }

    // Check for collisions
    for (let obstacle of obstacles) {
        if (dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y) {
            gameOver = true;
            restartButton.style.display = 'block';
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dino with running animation
    const frameX = currentFrame * dino.width; // Assuming sprite sheet layout
    ctx.drawImage(dinoImg, frameX, 0, dino.width, dino.height, dino.x, dino.y, dino.width, dino.height);

    // Draw obstacles
    for (let obstacle of obstacles) {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Draw score
    ctx.fillStyle = darkTheme ? 'white' : 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    if (gameOver) {
        ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && dino.y === 206 && gameStarted) {
        isJumping = true;
    }
});

// Add touch event listener for mobile devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    if (dino.y === 206 && gameStarted) {
        isJumping = true;
    }
}, { passive: false });

startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    resetGame();
});

restartButton.addEventListener('click', () => {
    gameStarted = true;
    restartButton.style.display = 'none';
    resetGame();
});

themeButton.addEventListener('click', () => {
    darkTheme = !darkTheme;
    document.body.classList.toggle('dark-mode', darkTheme);
    document.getElementById('game-container').classList.toggle('dark-mode', darkTheme);
    canvas.classList.toggle('dark-mode', darkTheme);
});