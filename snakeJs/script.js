const xsize = 40
const ysize = 40

const screenSizeX = 20
const screenSizeY = 20
const interval = 200
const squareIndex = 3

var direction = 'right'
var running = true

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

var fruit = [getRandomInt(screenSizeX-1)+1, getRandomInt(screenSizeY-1)+1]

window.addEventListener('load', async () =>{
    const canvas = document.querySelector("#canvas")
    const ctx = canvas.getContext('2d')

    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    snake = [[1, 1]]
    while (running) {
        fillMap(ctx, "white")
        moveSnake(snake)
        drawSnake(snake, ctx)
        checkPos(snake, canvas)
        drawFruit(fruit, ctx, "red")
        drawCube(0, 0, ctx, "black")
        await sleep(interval)
    }
    endGame(canvas)
})

function generateFruit(snake) {
    snake.push([0, 0])
    fruit = [getRandomInt(screenSizeX-1)+1, getRandomInt(screenSizeY-1)+1]
    for(let i = 0; i < snake.length; i++) {
        if (fruit[0] == snake[i][0] && fruit[1] == snake[i][1]) generateFruit(snake)
    }  
}

function drawFruit(fruit, ctx, color) {
    ctx.fillStyle = color
    drawCube(fruit[0], fruit[1], ctx, color)
}

async function changeDirection(event) {
    var key = event.key
    if(key == 'w' && direction != 'down') direction = 'up'
    else if(key == 'a' && direction != 'right') direction = 'left'
    else if(key == 's' && direction != 'up') direction = 'down'
    else if(key == 'd' && direction != 'left') direction = 'right'
}

function endGame(canvas) {
    canvas.remove()
}

function checkPos(snake, canvas) {
    if (snake[0][0] == screenSizeX) endGame(canvas)
    else if (snake[0][0] < 1) endGame(canvas)
    else if (snake[0][1] == screenSizeY) endGame(canvas)
    else if (snake[0][1] < 1) endGame(canvas)
    else if (snake[0][0] == fruit[0] && snake[0][1] == fruit[1]) {
        generateFruit(snake)
    }
    for(let i = 1; i < snake.length; i++) {
        if (snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1]) endGame(canvas)
    }
}

function sleep(ms) {
    return new Promise((accept) => {
        setTimeout(() => {
            accept()
        }, ms)
    })
}

function moveSnake(snake) {
    for (var i = snake.length - 1; i >= 0; i--) {
        if (i != 0) {
            snake[i][0] = snake[i - 1][0]
            snake[i][1] = snake[i - 1][1]
        } else {
            switch (direction) {
                case 'up':
                    snake[0][1] -= 1
                    break
                case 'down':
                    snake[0][1] += 1
                    break
                case 'right':
                    snake[0][0] += 1
                    break
                case 'left':
                    snake[0][0] -= 1
                    break
                default:
                    break
            }
        }
    }
}

function drawSnake(snake, ctx) {
    for (let x = 0; x < snake.length; x++) {
        if (x == 0) {
            drawCubeSnake(snake[x][0], snake[x][1], ctx, "rgb(0, 0, 255)")
        } else {
            drawCubeSnake(snake[x][0], snake[x][1], ctx, "rgb(" + x*3 + ", 0, 150)")
        }
    }
}

function drawCube(x, y, ctx, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * xsize, y * ysize, xsize-1, ysize-1)
}

function drawCubeSnake(x, y, ctx, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * xsize + squareIndex, y * ysize + squareIndex, xsize - squareIndex*2, ysize - squareIndex*2)
}

function fillMap(ctx, color) {
    ctx.fillStyle = color
    for (let x = 1; x < screenSizeX; x++) {
        for (let y = 1; y < screenSizeY; y++) {
            drawCube(x, y, ctx, color)
        }
    }
}

window.addEventListener('keypress', changeDirection)