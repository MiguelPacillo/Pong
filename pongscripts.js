var canvas, c, canWidth, canHeight, playerX, playerY, playerVelX, playerVelXMod, playerWidth, playerHeight, enemyX, enemyY, enemyVelX, enemyVelXMod, 
enemyWidth, enemyHeight, ballWidth, ballHeight, ballX, ballY, ballVelY, ballVelX, time, currentTime, deltaTime, playerScore, enemyScore, restart, keepAnimating;

const tickRate = 1;

window.onload = function() {
    canvas = document.getElementById("pong-canvas");
    c = canvas.getContext("2d");
    canWidth = canvas.width;
    canHeight = canvas.height;

    startGame();
}

function startGame() { // Shows title and loss/win screen, sets default values

    c.clearRect(0, 0, canvas.width, canvas.height);

    if (playerScore == 10) {
        c.beginPath();
        c.fillStyle = "green";
        c.font = "bold 50px Arial";
        c.fillText("You win!", (canWidth / 2) - 95, (canHeight / 2) - 30);
        c.closePath();

        c.beginPath();
        c.fillStyle = "black";
        c.font = "italic 20px Arial";
        c.fillText("Press enter for new game", (canWidth / 2) - 110, (canHeight / 2) + 20);
        c.closePath();
    } else if (enemyScore == 10) {
        c.beginPath();
        c.fillStyle = "red";
        c.font = "bold 50px Arial";
        c.fillText("You lose!", (canWidth / 2) - 107, (canHeight / 2) - 30);
        c.closePath();

        c.beginPath();
        c.fillStyle = "black";
        c.font = "italic 20px Arial";
        c.fillText("Press enter for new game", (canWidth / 2) - 110, (canHeight / 2) + 20);
        c.closePath();
    } else {
        c.beginPath();
        c.fillStyle = "black";
        c.font = "bold 50px Arial";
        c.fillText("Pong", (canWidth / 2) - 55, (canHeight / 2) - 30);
        c.closePath();

        c.beginPath();
        c.fillStyle = "black";
        c.font = "20px Arial";
        c.fillText("Use left and right arrow keys to move the paddle", (canWidth / 2) - 220, (canHeight / 2) + 20);
        c.closePath();

        c.beginPath();
        c.fillStyle = "black";
        c.font = "italic 20px Arial";
        c.fillText("Press enter to start", (canWidth / 2) - 80, (canHeight / 2) + 60);
        c.closePath();
    }

    playerWidth = 60;
    playerHeight = 15;
    playerX = 300;
    playerY = 710;
    playerVelX = 0;
    playerVelXMod = 370;

    enemyWidth = 60;
    enemyHeight = 15;
    enemyX = 300;
    enemyY = 70;
    enemyVelX = 0;
    enemyVelXModStraight = 300; // Enemy paddle speed when ball is straight speed
    enemyVelXModSharp = 370; // Enemy paddle speed when ball is sharp speed
    enemyVelXMod = enemyVelXModStraight; // By default it's straight speed

    ballWidth = 15;
    ballHeight = 15;
    ballX = canWidth / 2;
    ballY = 200;
    ballVelY = 400;
    ballVelX = 400;
    ballVelXStraight = 300; // Straight speed for ball when hit in center paddle
    ballVelXSharp = 400; // Sharp speed for ball when hit on sides of paddle

    restart = true; // Makes sure you can't press enter for new game unless you're in startGame
}

function move(e) {
    if (e.keyCode == 39) { // Move right
        playerVelX = playerVelXMod;
    }
    if (e.keyCode == 37) { // Move left
        playerVelX = playerVelXMod * -1;
    }
    if (e.keyCode == 13 && restart == true) { // Enter for new game
        restart == false;
        keepAnimating = true; // Makes sure animation doesn't stop
        playerScore = 0;
        enemyScore = 0;
        time = performance.now();
        animate();
    }
}

function stop(e) {
    if (e.keyCode == 39) {
        if (playerVelX == playerVelXMod) {
            playerVelX -= playerVelXMod;
        }
    }
    if (e.keyCode == 37) {
        if (playerVelX == playerVelXMod * -1) {
            playerVelX += playerVelXMod;
        }
    }
}

function ball() {
    c.beginPath();
    c.arc(ballX + ballWidth / 2, ballY + ballHeight / 2, ballWidth / 2, 0, 2 * Math.PI);
    c.fillStyle = "blue";
    c.fill();
    c.closePath();

    ballX += ballVelX * deltaTime;
    ballY += ballVelY * deltaTime;

    // Ball hit detection (Forces negative or positive velocity rather than flipping it for better stability)

    if ((ballY + ballHeight > playerY && ballY < playerY + playerHeight) && (ballX < playerX + playerWidth && ballX + ballWidth > playerX)) { // Player paddle
        ballVelY = Math.abs(ballVelY) * -1;
        if ((ballX + (ballWidth / 2) <= playerX + (playerWidth / 2) - 15) || ballX + (ballWidth / 2) >= playerX + (playerWidth / 2) + 15) { // Hits ball at an angle (sides)
            ballVelX = ballVelXSharp * Math.sign(ballVelX);
        } else { // Hits ball straight (middle of paddle)
            ballVelX = ballVelXStraight * Math.sign(ballVelX);
        }

    } else if ((ballY < enemyY + enemyHeight && ballY + ballHeight > enemyY) && (ballX < enemyX + enemyWidth && ballX + ballWidth > enemyX)) { // Enemy paddle
        ballVelY = Math.abs(ballVelY);

    } else if (ballX < 0) { // Left wall
        ballVelX = Math.abs(ballVelX);

    } else if (ballX + ballWidth > canWidth) { // Right wall
        ballVelX = Math.abs(ballVelX) * -1;
        
    } else if (ballY + ballHeight > canHeight) { // Player loses
        ballVelX = ballVelXSharp * Math.sign(ballVelX);
        ballX = canWidth / 2
        ballY = enemyY + 10;
        ballVelY = Math.abs(ballVelY);
        enemyScore ++;
    } else if (ballY < 0) { // Enemy loses
        ballVelX = ballVelXSharp * Math.sign(ballVelX);
        ballX = canWidth / 2
        ballY = playerY - 10;
        ballVelY = Math.abs(ballVelY) * -1;
        playerScore ++;
    }
}

function playerPaddle() {
    c.beginPath();
    c.rect(playerX, playerY, playerWidth, playerHeight);
    c.fillStyle = "green";
    c.fill();
    c.closePath();
    
    playerX += playerVelX * deltaTime;

    // Keeps player paddle in view

    if (playerX + playerWidth > canWidth) {
        playerX = canWidth - playerWidth;
    } else if (playerX < 0) {
        playerX = 0;
    }

    
}

function enemyPaddle() {
    c.beginPath();
    c.rect(enemyX, enemyY, enemyWidth, enemyHeight);
    c.fillStyle = "red";
    c.fill();
    c.closePath();

    // Enemy paddle changes speed depending on the speed of the ball

    if (ballVelX == ballVelXStraight * Math.sign(ballVelX)) { // If ball is hit straight
        enemyVelXMod = enemyVelXModStraight * Math.sign(enemyVelXMod);
    } else { // If ball is hit at an angle
        enemyVelXMod = enemyVelXModSharp * Math.sign(enemyVelXMod);
    }

    // General enemy paddle behavior

    if (ballY < canHeight / 2 + 250) { // Enemy paddle starts moving just after ball returns from player paddle
        if (ballX + ballWidth / 2 > enemyX + enemyWidth / 2) {
            if (enemyX + enemyWidth > canWidth) {
                enemyX = canWidth - enemyWidth;
            } else {
                enemyVelX = enemyVelXMod;
            }
        } else if (ballX + ballWidth / 2 < enemyX + enemyWidth / 2) {
            if (enemyX < 0) {
                enemyX = 0;
            } else {
                enemyVelX = enemyVelXMod * -1;
            }
        }
    } else {
        enemyVelX = 0;
    }

    enemyX += enemyVelX * deltaTime;
}

function scoreKeeper() {
    c.beginPath();
    c.fillStyle = "green";
    c.font = "30px Arial";
    c.fillText(playerScore, canWidth - 50, (canHeight / 2) + 40);
    c.closePath();

    c.beginPath();
    c.fillStyle = "red";
    c.font = "30px Arial";
    c.fillText(enemyScore, canWidth - 50, (canHeight / 2) - 20);
    c.closePath();
    
    // Ends game when either score reaches 10

    if (enemyScore == 10 || playerScore == 10) {
        keepAnimating = false; // Stops requestAnimationFrame
    }
}

function animate() {

    if (keepAnimating == false) { // Returns to startGame
        startGame();

    } else {

        // Generates deltatime as movement multiplier so movement isn't dependent on framerate

        currentTime = performance.now();
        deltaTime = (currentTime - time) / 1000;
        time = currentTime;

        requestAnimationFrame(animate);

        c.clearRect(0, 0, canvas.width, canvas.height); // Clears canvas after every frame
        c.beginPath();
        c.setLineDash([15, 5]);
        c.moveTo(0, canHeight / 2);
        c.lineTo(canWidth, canHeight / 2);
        c.strokeStyle = "black";
        c.stroke();
        c.closePath();
    
        playerPaddle();
        enemyPaddle();
        ball();
        scoreKeeper();
    }
}

document.onkeydown = move;
document.onkeyup = stop;
