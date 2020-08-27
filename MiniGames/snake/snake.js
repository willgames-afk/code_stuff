var snake = {
    x: 0,
    y: 0,
    bodySegments: [],
    length: 0,
    direction: 4,
    wraparound: true,
    gameover: false,
    score: 0,
}
var fruit = {
    x:0,
    y:0
}
var tilemap = new Tilemap(21, 21, 10, 'snakeCanvas')


//var interval = window.setInterval(loop, 1000)

function loop() {
    moveSnake()
    detectCollisions()

    tilemap.render()
}
function moveSnake() {
    //moves the snake
    if (snake.direction > 3) {
        return
    } else {
        if (snake.direction == 0) {
            snake.y += 1
        } else if (snake.direction == 1) {
            snake.x += 1
        } else if (snake.direction == 2) {
            snake.y -= 1
        } else if (snake.direction == 3) {
            snake.x -= 1
        }
        snake.bodySegments.unshift([snake.x, snake.y])
        snake.bodySegments.pop()
    }
}
function detectCollisions() {
    //wall collision & wraparound
    if (snake.x > 21) {
        if (snake.wraparound) {
            snake.x = 0
        } else {
            gameover = true
        }
    } else if (snake.x < 0) {
        if (snake.wraparound) {
            snake.x = 21
        } else {
            gameover = true
        }
    }
    if (snake.y > 21) {
        if (snake.wraparound) {
            snake.y = 0
        } else {
            gameover = true
        }
    } else if (snake.y < 0) {
        if (snake.wraparound) {
            snake.y = 21
        } else {
            gameover = true
        }
    }
    //tail collision tdetection
    for (i=0;i<snake.bodySegments.length;i++) {
        if(snake.x == snake.bodySegments[i][0] && snake.y == snake.bodySegments[i][1]) {
            snake.gameover = true;
        }
    }

    if (snake.x == fruit.x && snake.y == fruit.y) {
        snake.score += 1
        moveFruit()
    }
}
function moveFruit() {
    var valid = false
    while (valid == false) {
        fruit.x = floor(Math.random()*21)
        fruit.y = floor(Math.random()*21)
        for (i=0;i<snake.bodySegments.length;i++) {
            if (fruit.x == snake.bodySegments[i][0] && fruit.y == snake.bodySegments[i][1]) {
                
            }
        }
    }
}
function handleKeyboard(e) {
    if (e.key == 'w') {
        snake.direction = 0
    } else if (e.key == 'd') {
        snake.direction = 1
    } else if (e.key == 's') {
        snake.direction = 2
    } else if (e.key == 'a') {
        snake.direction = 3
    }
}