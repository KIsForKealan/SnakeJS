const BACKGROUND_COLOUR = '#E0FFFF';
const SNAKE_COLOUR = '#00008B';
const FOOD_COLOUR = '#7FFFD4';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = canvas.height = 400;

const FRAME_RATE = 10;
const SCREEN_SIZE = 20;
const TILE_SIZE = (canvas.width / SCREEN_SIZE);

let position, velocity, food, snake;

function init() {
    position = {x: 10, y: 10};
    velocity = {x: 0, y: 0};

    snake = [
        {x: 8, y: 10},
        {x: 9, y: 10},
        {x: 10, y: 10}
    ]

    spawnFood();
}

init();

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * TILE_SIZE),
        y: Math.floor(Math.random() * TILE_SIZE),
    }

    for (let cell of snake) {
        if (cell.x === food.x && food.y === cell.y) {
            return spawnFood();
        }
    }
}

document.addEventListener('keydown', keyDown);

function keyDown(e) {
    switch (e.keyCode) {
        case 37: { // left
            return velocity = {x: -1, y: 0};
        }
        case 38: { // up
            return velocity = {x: 0, y: -1};
        }
        case 39: { // right
            return velocity = {x: 1, y: 0};
        }
        case 40: { // down
            return velocity = {x: 0, y: 1};
        }
    }
}

setInterval(() => { 
    requestAnimationFrame(gameLoop); 
}, (1000 / FRAME_RATE));

function gameLoop() {
    context.fillStyle = BACKGROUND_COLOUR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = SNAKE_COLOUR;
    for (let cell of snake) {
        context.fillRect(cell.x*SCREEN_SIZE, cell.y*SCREEN_SIZE, SCREEN_SIZE, SCREEN_SIZE);
    }

    context.fillStyle = FOOD_COLOUR;
    context.fillRect(food.x*SCREEN_SIZE, food.y*SCREEN_SIZE, SCREEN_SIZE, SCREEN_SIZE);

    position.x += velocity.x;
    position.y += velocity.y;

    if (position.x < 0 || position.x > TILE_SIZE || position.y < 0 || position.y > TILE_SIZE) {
        // gone off the board, restart
        init();
    }

    if (food.x === position.x && food.y === position.y) {
        snake.push({...position});
        position.x += velocity.x;
        position.y += velocity.y;
        spawnFood();
    }

    if (velocity.x || velocity.y) {
        for (let cell of snake) {
            if (cell.x === position.x && cell.y === position.y) {
                return init(); // crashed into self, restart
            }
        }
        snake.push({...position});
        snake.shift();
    }
}