var snake = {
    x: 10,
    y: 10,
    bodySegments: [[10,11]],
    length: 2,
    directionBuffer: [0],
    gameover: false,
    score: 0,
}
var wraparound = true
var hiScore = 0
var defaults = JSON.stringify(snake)
var fruit = {
    x: 0,
    y: 0
}
var gameOverScreen = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,0,0,1,1,0,0,1,0,0,0,1,0,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,1,1,0,1,1,0,1,0,0,0],
    [0,1,0,1,1,0,1,1,1,1,0,1,0,1,0,1,0,1,1,1,0],
    [0,1,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0,1,0,0,0],
    [0,1,1,1,1,0,1,0,0,1,0,1,0,0,0,1,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,1,1,1,0],
    [0,1,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
    [0,1,0,0,1,0,1,0,0,0,1,0,1,1,1,0,1,1,1,0,0],
    [0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0],
    [0,1,1,1,1,0,0,0,1,0,0,0,1,1,1,0,1,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]
var startScreen = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,1,1,1,0,0,1,0,0,1,0,1,0,1,1,1,0,0],
    [0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0],
    [0,1,1,0,1,0,1,0,1,1,1,0,1,1,0,0,1,1,1,0,0],
    [0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0],
    [0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,0,1,0,0,1,0,0,0,1,0,1,1,1,0,0],
    [0,1,0,0,0,0,1,0,1,0,1,1,0,1,1,0,1,0,0,0,0],
    [0,1,0,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,0],
    [0,1,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,0],
    [0,0,1,1,0,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]
var tilemap = new Tilemap(21, 21, 10, 'snakeCanvas')
var scoreboard = document.getElementById('score')
document.body.onkeydown = handleKeyboard
displayTileImage(startScreen)

function loop() {
    moveSnake()
    detectCollisions()
    displaySnake()
    displayScore()
    tilemap.render()
    if (snake.gameover == true) {
        displayTileImage(gameOverScreen)
        snake = JSON.parse(defaults)
        clearInterval(interval)
        interval = undefined
    }
}
var hiScoreString = '0000'
function displayScore() {
    var score = snake.score.toString(10)
    if (score < 1000) {
        score = '0'+score
        if (score < 100) {
            score = '0'+score
            if (score < 10) {
                score = '0'+score
            }
        }
    }
    if (snake.score > hiScore) {
        hiScore = snake.score
        hiScoreString = score
    }
    scoreboard.innerHTML = score + '       Hi:' + hiScoreString
}
function displayTileImage(array) {
    for(y=0;y<array.length;y++) {
        for (x=0;x<array[y].length;x++) {
            tilemap.setTile(x,y,array[y][x])
        }
    }
    tilemap.render()
}
function displaySnake() {
    tilemap.setTile(snake.x, snake.y, 1)
    snake.bodySegments.unshift([snake.x, snake.y])
    var lastSegment = snake.bodySegments.pop()
    //console.log(snake.bodySegments)
    tilemap.setTile(lastSegment[0], lastSegment[1], 0)
}
function moveSnake() {
    //moves the snake
    var direction = snake.directionBuffer[0]
    if (direction > 3) {
        console.log('nothin to do')
        return
    } else {
        if (direction == 0) {
            snake.y -= 1
        } else if (direction == 1) {
            snake.x += 1
        } else if (direction == 2) {
            snake.y += 1
        } else if (direction == 3) {
            snake.x -= 1
        }
    }
    if (snake.directionBuffer.length > 1) {
        snake.directionBuffer.shift()
    }
}
function detectCollisions() {
    //wall collision & wraparound
    if (snake.x == 21) {
        if (wraparound) {
            snake.x = 0
        } else {
            snake.gameover = true
        }
    } else if (snake.x == -1) {
        if (wraparound) {
            snake.x = 20
        } else {
            snake.gameover = true
        }
    }

    if (snake.y > 20) {
        if (wraparound) {
            snake.y = 0
        } else {
            snake.gameover = true
        }
    } else if (snake.y < 0) {
        if (wraparound) {
            snake.y = 20
        } else {
            snake.gameover = true
        }
    }
    //tail collision detection
    for (i = 0; i < snake.bodySegments.length; i++) {
        if (snake.x == snake.bodySegments[i][0] && snake.y == snake.bodySegments[i][1]) {
            console.log('gameover')
            snake.gameover = true;
        }
    }

    if (snake.x == fruit.x && snake.y == fruit.y) {
        snake.score += 1
        snake.bodySegments.push(snake.bodySegments[snake.bodySegments.length - 1])
        moveFruit()
    }
}
function moveFruit() {
    var valid = false
    while (valid == false) {
        fruit.x = Math.floor(Math.random() * 21)
        fruit.y = Math.floor(Math.random() * 21)
        valid = true
        for (i = 1; i < snake.bodySegments.length; i++) {//first body segment is head
            if (fruit.x == snake.bodySegments[i][0] && fruit.y == snake.bodySegments[i][1]) {
                valid = false
                break
            }
        }
    }
    tilemap.setTile(fruit.x, fruit.y, 2)
}
var interval
function handleKeyboard(e) {
    if (e.key == 'w' || e.key == 'ArrowUp' && !(snake.directionBuffer[0] == 2)) {
        snake.directionBuffer.push(0)
    } else if (e.key == 'd' || e.key == 'ArrowRight' && !(snake.directionBuffer[0] == 3)) {
        snake.directionBuffer.push(1)
    } else if (e.key == 's' || e.key == 'ArrowDown' && !(snake.directionBuffer[0] == 0)) {
        snake.directionBuffer.push(2)
    } else if (e.key == 'a' || e.key == 'ArrowLeft' && !(snake.directionBuffer[0] == 1)) {
        snake.directionBuffer.push(3)
    }
    if (e.key == 'g') {
        if (wraparound) {
            wraparound = false
        } else {
            wraparound = true
        }
    }
    if (!interval) {
        tilemap.clear()
        moveFruit()
        interval = window.setInterval(loop, 125)
    }
}