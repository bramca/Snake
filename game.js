var snake;
var enemy;
var food = [];
var pausebool = false;
var gameoverbool = false;
var weight = 20;
var startsize = 4;
var winner;
var canvas;
var winnerstats = {};
var showstats = false;
var gamemode = 1;

var snakecolor = ntc.name(randomcolor());
var enemycolor = ntc.name(randomcolor());

function randomcolor() {
    return '#' + (function co(lor){   return (lor +=
                                              [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
                                      && (lor.length == 6) ?  lor : co(lor); })('');
}

window.addEventListener("keydown", function (e) {
    // space en arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var sketch = function (p) {
    p.setup = function () {
        var c = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas = c.canvas;
        document.getElementById("canvascontainer").appendChild(c.canvas);
        document.body.scrollTop = 0;
        p.frameRate(10);
        food = [];
        snake = new Snake({ x: Math.floor(Math.random() * (Math.floor(p.width / weight) + 1)) * weight, y: Math.floor(Math.random() * (Math.floor(p.height / weight) + 1)) * weight }, startsize, snakecolor[1], weight, snakecolor[0]);
        enemy = new Snake({ x: Math.floor(Math.random() * (Math.floor(p.width / weight) + 1)) * weight, y: Math.floor(Math.random() * (Math.floor(p.height / weight) + 1)) * weight }, startsize, enemycolor[1], weight, enemycolor[0]);
        enemy.isAI = (gamemode === 1 || gamemode === 3 ? true : false);
        snake.isAI = (gamemode === 3 ? true : false);
        gameoverbool = false;
        if (!winnerstats[snake.color]) {
            winnerstats[snake.color] = [0, 0];
        }
        if (!winnerstats[enemy.color]) {
            winnerstats[enemy.color] = [0, 0];
        }
        p.loop();
    }


    p.draw = function () {
        if (!gameoverbool) {
            p.background(31);
        }
        if (p.frameCount % 30 === 0) {
            food.push(new Food([Math.floor(Math.random() * (Math.floor(p.width / weight) + 1)) * weight, Math.floor(Math.random() * (Math.floor(p.height / weight) + 1)) * weight], "rgb(0,255,0)", 1, weight));
        } else if (p.frameCount % 110 === 0) {
            food.push(new Food([Math.floor(Math.random() * (Math.floor(p.width / weight) + 1)) * weight, Math.floor(Math.random() * (Math.floor(p.height / weight) + 1)) * weight], "rgb(230,0,230)", 3, weight));
        }
        if (!snake.isAI) {
            snake.updatecoordinates();
        } else {
            snake.searchObject(enemy, food, p, 1);
        }
        snake.checkEdges(p);
        if (!enemy.isAI) {
            enemy.updatecoordinates();
        } else {
            enemy.searchObject(snake, food, p, 0);
        }
        enemy.checkEdges(p);
        if (!snake.isAI && enemy.isAI) {
            var bool1, bool2;
            if ((bool1 = snake.checkSelfCollision()) || (bool2 = snake.checkEnemyCollision(enemy)) || enemy.checkEnemyCollision(snake)) {
                if (!gameoverbool) {
                    if (bool1 || bool2) {
                        winner = enemy;
                    } else {
                        winner = snake;
                    }
                }
                if (snake !== winner) {
                    snake.render(p);
                } else {
                    enemy.render(p);
                }
                winner.render(p);
                for (var i = 0; i < food.length; i++) {
                    food[i].render(p);
                }
                gameover();
                writeScore();
            }
        } else if (!snake.isAI && !enemy.isAI) {
            var bool1, bool2;
            if ((bool1 = snake.checkEnemyCollision(enemy)) || (bool2 = snake.checkSelfCollision()) || enemy.checkSelfCollision() || enemy.checkEnemyCollision(snake)) {
                if (!gameoverbool) {
                    if (bool1 || bool2) {
                        winner = enemy;
                    } else {
                        winner = snake;
                    }
                }
                if (snake !== winner) {
                    snake.render(p);
                } else {
                    enemy.render(p);
                }
                winner.render(p);
                for (var i = 0; i < food.length; i++) {
                    food[i].render(p);
                }
                gameover();
                writeScore();
            }
        } else if (snake.isAI && enemy.isAI) {
            var bool1;
            if ((bool1 = snake.checkEnemyCollision(enemy)) || enemy.checkEnemyCollision(snake)) {
                if (!gameoverbool) {
                    if (bool1) {
                        winner = enemy;
                    } else {
                        winner = snake;
                    }
                }
                if (snake !== winner) {
                    snake.render(p);
                } else {
                    enemy.render(p);
                }
                winner.render(p);
                for (var i = 0; i < food.length; i++) {
                    food[i].render(p);
                }
                gameover();
                writeScore();
            }
        }

        if (!gameoverbool) {
            snake.render(p);
            enemy.render(p);
            for (var i = 0; i < food.length; i++) {
                if (snake.checkOverFood(food[i])) {
                    snake.eat(food[i]);
                    food.splice(i, 1);
                } else if (enemy.checkOverFood(food[i])) {
                    enemy.eat(food[i]);
                    food.splice(i, 1);
                }
            }
            for (var i = 0; i < food.length; i++) {
                food[i].render(p);
            }
            writeScore();
        }
    }

    p.keyPressed = function () {
        if (p.keyCode === p.LEFT_ARROW && !snake.isAI) {
            snake.changeXDir(-1);
        } else if (p.keyCode === p.RIGHT_ARROW && !snake.isAI) {
            snake.changeXDir(1);
        } else if (p.keyCode === p.DOWN_ARROW && !snake.isAI) {
            snake.changeYDir(1);
        } else if (p.keyCode === p.UP_ARROW && !snake.isAI) {
            snake.changeYDir(-1);
        } else if (p.key === 'P' && !gameoverbool) {
            pausebool = !pausebool;
            if (pausebool) {
                p.noLoop();
            } else {
                p.loop();
            }
        } else if (p.key === 'F') {
            var fs = p.fullscreen();
            p.fullscreen(!fs);
        } else if (gameoverbool && p.key === 'R') {
            p.setup();
        } else if (p.key === 'Q' && !enemy.isAI) {
            enemy.changeXDir(-1);
        } else if (p.key === 'D' && !enemy.isAI) {
            enemy.changeXDir(1);
        } else if (p.key === 'S' && !enemy.isAI) {
            enemy.changeYDir(1);
        } else if (p.key === 'Z' && !enemy.isAI) {
            enemy.changeYDir(-1);
        } else if (p.key === '1') {
            gamemode = 1;
            snake.isAI = false;
            enemy.isAI = true;
        } else if (p.key === '2') {
            gamemode = 2;
            snake.isAI = false;
            enemy.isAI = false;
        } else if (p.key === '3') {
            gamemode = 3;
            snake.isAI = true;
            enemy.isAI = true;
        } else if (p.key === 'A') {
            showstats = !showstats;
            if (pausebool || gameoverbool) {
                p.background(31);
                snake.render(p);
                enemy.render(p);
                for (var i = 0; i < food.length; i++) {
                    food[i].render(p);
                }
                writeScore();
                if (pausebool) {
                    pause();
                } else if (gameoverbool) {
                    gameover();
                }
            }
        }
    }

    p.keyReleased = function () {
        if (pausebool && p.key === 'P') {
            pause();
        }
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        if (gameoverbool || pausebool) {
            p.background(31);
            snake.render(p);
            enemy.render(p);
            food.forEach(function (e) {
                e.render(p);
            }, this);
            writeScore();
        }
        if (gameoverbool) {
            gameover();
        } else if (pausebool) {
            pause();
        }
    }

    function pause() {
        p.fill(140);
        p.stroke(0);
        p.textSize(30);
        p.textAlign(p.CENTER);
        p.text("(P)aused", p.width / 2, p.height / 2);
    }

    function gameover() {
        if (!gameoverbool) {
            if (snake.size > winnerstats[snake.color][0]) {
                winnerstats[snake.color][0] = snake.size - startsize;
            }
            if (enemy.size > winnerstats[enemy.color][0]) {
                winnerstats[enemy.color][0] = enemy.size - startsize;
            }
            winnerstats[winner.color][1] += 1;
        }
        gameoverbool = true;
        p.fill(140);
        p.stroke(0);
        p.textSize(30);
        p.textAlign(p.CENTER);
        p.text("Game Over\n" + winner.color + " won\n" + "(R)estart", p.width / 2, p.height / 2);
        p.noLoop();
        if (snake.isAI && enemy.isAI) {
            setTimeout(function () {
                p.key = 'R';
                p.keyPressed();
            }, 3000);
        }
    }

    function writeScore() {
        p.fill(140);
        p.stroke(0);
        p.textSize(30);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(snake.color + ": " + (snake.size - startsize) + "\n" + enemy.color + ": " + (enemy.size - startsize), p.width - 10, 40);
        if (showstats || gameoverbool) {
            p.textAlign(p.LEFT, p.CENTER);
            p.text(snake.color + ": wins - " + winnerstats[snake.color][1] + " maxsize - " + winnerstats[snake.color][0] + "\n"
                    + enemy.color + ": wins - " + winnerstats[enemy.color][1] + " maxsize - " + winnerstats[enemy.color][0], 10, 40);
        }
    }
}

var app = new p5(sketch);
