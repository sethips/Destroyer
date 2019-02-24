var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3;
var dy = -3;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 8;
var brickColumnCount = 6;
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var highscore = 0;
var hitSound=new Audio("assets/Audio/hit.mp3");
var loseSound=new Audio("assets/Audio/lose.mp3");
var winSound=new Audio("assets/Audio/win.mp3");
var fallSound=new Audio("assets/Audio/fall.mp3");
var rainSound=new Audio("assets/Audio/rain.mp3");
var brickHit=0;
var storedx=0;
var storedy=0;


var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1,isBonus:0 };
    }
}
bricks[0][Math.floor(Math.random()*(5))].isBonus=1;
bricks[1][Math.floor(Math.random()*(5))].isBonus=1;
bricks[2][Math.floor(Math.random()*(5))].isBonus=1;



var dialogBox=$("<div>Choose Controls</div>");
var settings=$("<div>Choose Difficulty level</div>");
settings.dialog({
    dialogClass: "no-close",
    autoOpen: true,
    buttons: {

        Easy: function() {
            paddleWidth=100;
            dx=3;
            dy=-3;
            storedx=dx;
            storedy=dy;
            settings.dialog("close");
            chooseControls();
        },
        Medium: function() {
            paddleWidth=75;
            difficulty=1;
            dx=4;
            dy=-4;
            storedx=dx;
            storedy=dy;
            settings.dialog("close");
            chooseControls();
        },
        Difficult: function() {
            paddleWidth=50;
            dx=5;
            dy=-5;
            storedx=dx;
            storedy=dy;
            settings.dialog("close");
            chooseControls();
        }

    },
    width: "400px"
});


function chooseControls() {
    dialogBox.dialog({
        dialogClass: "no-close",
        autoOpen: true,
        buttons: {

            Keyboard: function() {

                document.addEventListener("keydown", keyDownHandler, false);
                document.addEventListener("keyup", keyUpHandler, false);
                dialogBox.dialog("close");
                draw();
            },
            Mouse: function() {

                document.addEventListener("mousemove", mouseMoveHandler, false);
                document.removeEventListener("keydown",function removeKeyboard() {
                    console.log("Keyboard removed");
                });
                document.removeEventListener("keyup",function removeKeyup() {
                    console.log("Keyboard Removed");
                })
                dialogBox.dialog("close");
                draw();
            }

        },
        width: "400px"
    });
}


function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    brickHit++;
                    hitSound.currentTime=0;
                    hitSound.play();
                    dy = -dy;
                    b.status = 0;
                    if(b.isBonus===0)
                        score++;
                    else
                        score+=5;
		    if(score>highscore) highscore = score;
                    if(brickHit == brickRowCount*brickColumnCount) {
                        winSound.play();
                        setTimeout(function () {
                            alert("CONGRATULATIONS!!!! YOU WON THE GAME");
                            restart();
                        });
                        return;
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                if(bricks[c][r].isBonus===0)
                    ctx.fillStyle = "#000";
                else
                    ctx.fillStyle = "#000"
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Roboto";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawHighScore() {
    ctx.font = "16px Roboto";
    ctx.fillStyle = "#000";
    ctx.fillText("High Score: "+highscore, canvas.width/2 - 20, 20);
}
function drawLives() {
    ctx.font = "16px Roboto";
    ctx.fillStyle = "#000";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawHighScore();
    drawLives();
    collisionDetection();
    rainSound.play();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                loseSound.play();
                setTimeout(function(){
                    alert("GAME OVER");
                restart();
                resetPaddle();
                },1000);
                return;
            }
            else {
                fallSound.play();
                x = canvas.width/2;
                y = canvas.height-30;
                dx = storedx;
                dy = storedy;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    resetPaddle();
}
function restart(){
	score = 0;
	brickHit=0;
	lives = 3;
	for(c=0; c<brickColumnCount; c++) {
    	bricks[c] = [];
    	for(r=0; r<brickRowCount; r++) {
        	bricks[c][r] = { x: 0, y: 0, status: 1,isBonus:0 };
        }
	}
    bricks[0][Math.floor(Math.random()*(5))].isBonus=1;
    bricks[1][Math.floor(Math.random()*(5))].isBonus=1;
    bricks[2][Math.floor(Math.random()*(5))].isBonus=1;
	x = canvas.width/2;
	y = canvas.height-30;
	dx = storedx;
	dy = storedy;
}

function resetPaddle() {
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

