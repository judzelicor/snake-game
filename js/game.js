class GAME {
  start() {
    snake.renderSnake();
    document.addEventListener('keydown', controlSnake);
    spawnFood();
  }

  gameOver() {
    for (let iterator = 0; iterator < snake.SNAKE.length; iterator++) {
      gameScreen.GAME_SCREEN_TILES[snake.SNAKE[iterator]].classList.add('lose');
    }
    gameScreen.LOSE_SFX.play();
    displayPlayerPromptScreen()
  }

  updateScore() {
    gameScreen.PLAYER_SCORE += 1;
    const score = document.querySelector('.score');
    score.textContent = gameScreen.PLAYER_SCORE;
  }

  restart() {
    recordPlayer();
    document.querySelector('.player-prompt').style.display = "none";
    for (let iterator = 0; iterator < gameScreen.GAME_SCREEN_TILE_COUNT; iterator++) {
      gameScreen.GAME_SCREEN_TILES[iterator].remove();
    }
    snake.SNAKE = [4, 3, 2, 1, 0];
    gameScreen.GAME_SCREEN_TILES = [];
    snake.SNAKE_DIRECTION  = 1;
    gameScreen.renderGrid();
    snake.renderSnake();
    gameScreen.PLAYER_SCORE = 0;
    document.querySelector('.score').textContent = gameScreen.PLAYER_SCORE
    document.addEventListener('keydown', controlSnake);
    spawnFood();
    game.INTERVAL = setInterval(moveSnake, snake.SNAKE_SPEED)
  }

  showLeaderBoard() {
    if (localStorage.length > 0) {
      for (let iterator = 0; iterator < localStorage.length; iterator++) {
        const row = document.createElement('tr');
        row.innerHTML += `
        <td>${localStorage.key(iterator)}</td>
        <td>${localStorage.getItem(localStorage.key(iterator))}</td>
        `
        document.querySelector('.leaderboard table').appendChild(row)
      }
    }
  }
}

function recordPlayer(event) {
  const playerPromptField = document.querySelector('.player-name');
  const player = playerPromptField.value;
  localStorage.setItem(player, JSON.stringify(gameScreen.PLAYER_SCORE))
}

function displayPlayerPromptScreen() {
  document.querySelector('.lose').addEventListener('animationend', function () {
    document.querySelector('.player-prompt').style.display = "flex";
    document.querySelector('.restart').addEventListener('click', game.restart)
  })
}


class GAME_SCREEN {
  constructor () {
    this.GAME_SCREEN = document.getElementById('gameScreen');
    this.GAME_SCREEN_TILES = [];
    this.GAME_SCREEN_TILE_ROW_COUNT = 40;
    this.GAME_SCREEN_TILE_COUNT = this.GAME_SCREEN_TILE_ROW_COUNT ** 2;
    this.GAME_SCREEN_TILE_SIZE = 15;                                                            // this is the size of each tile or cell in pixels
    this.GAME_SCREEN_WH = (this.GAME_SCREEN_TILE_ROW_COUNT * this.GAME_SCREEN_TILE_SIZE);      // the product is the area of the grid in pixels
    this.LOSE_SFX =  document.getElementById('gameOver');
    this.PLAYER_SCORE = 0;
    this.TITLE_SCREEN_CONTROLS = document.querySelector('.title-screen-controls ul');
  }

  renderGrid() {
    this.GAME_SCREEN.style.width = `${this.GAME_SCREEN_WH}px`;
    this.GAME_SCREEN.style.height = `${this.GAME_SCREEN_WH}px`;
    for (let iterator = 0; iterator < this.GAME_SCREEN_TILE_COUNT; iterator++) {
      const gameTile = document.createElement('div');
      gameTile.style.width = gameTile.style.height = `${this.GAME_SCREEN_TILE_SIZE}px`;
      gameTile.className = "game-tile";
      this.GAME_SCREEN_TILES.push(gameTile);
      this.GAME_SCREEN.appendChild(gameTile);
    }
  }
}

class SNAKE {
  constructor () {
    this.SNAKE = [4, 3, 2, 1, 0];
    this.SNAKE_DIRECTION = 1;
    this.SNAKE_SPEED = 100;
    this.LOOPED = false;
  }

  renderSnake() {
    for (let iterator = 0; iterator < this.SNAKE.length; iterator++) {
      gameScreen.GAME_SCREEN_TILES[this.SNAKE[iterator]].classList.add('snake');
    }
  }
}

class SNAKE_FOOD {
  constructor () {
    this.SNAKE_FOOD = document.createElement('img');
    this.SNAKE_FOOD.src = './images/snake-food.png';
    this.FOOD_SPAWNPOINT = undefined;
  }
}

const gameScreen = new GAME_SCREEN,
      game = new GAME,
      snake = new SNAKE,
      snakeFood = new SNAKE_FOOD;


let multiplier = -1;
function moveSnake() {
  if (
    (snake.SNAKE[0] + gameScreen.GAME_SCREEN_TILE_ROW_COUNT > 1599 && snake.SNAKE_DIRECTION === gameScreen.GAME_SCREEN_TILE_ROW_COUNT) ||
    (snake.SNAKE[0] - gameScreen.GAME_SCREEN_TILE_ROW_COUNT < 0 && snake.SNAKE_DIRECTION === -gameScreen.GAME_SCREEN_TILE_ROW_COUNT) ||
    (snake.SNAKE[0] % 40 === 0 && snake.SNAKE_DIRECTION === -1) ||
    (snake.SNAKE[0] % 40 === 39 && snake.SNAKE_DIRECTION === 1)
    ) {
    snake.LOOPED = true;
  }

  if (snake.LOOPED === false && gameScreen.GAME_SCREEN_TILES[snake.SNAKE[0] + snake.SNAKE_DIRECTION].classList.contains('snake')) {
    game.gameOver();
    clearInterval(game.INTERVAL);
  }

  if (!snake.LOOPED) {
    let tail = snake.SNAKE.pop();
    gameScreen.GAME_SCREEN_TILES[tail].classList.remove('snake');
    snake.SNAKE.unshift(snake.SNAKE[0] + snake.SNAKE_DIRECTION);
    gameScreen.GAME_SCREEN_TILES[snake.SNAKE[0]].classList.add('snake');
    multiplier = -1
    snake.LOOPED = false;
  } else {
    if (snake.SNAKE_DIRECTION === gameScreen.GAME_SCREEN_TILE_ROW_COUNT) {
      multiplier += 1;
      let tail = snake.SNAKE.pop();
      gameScreen.GAME_SCREEN_TILES[tail].classList.remove('snake');
      snake.SNAKE.unshift((snake.SNAKE[0] % snake.SNAKE_DIRECTION) + (multiplier * snake.SNAKE_DIRECTION));
      gameScreen.GAME_SCREEN_TILES[snake.SNAKE[0]].classList.add('snake');
      snake.LOOPED = false;
    } else if (snake.SNAKE_DIRECTION === -gameScreen.GAME_SCREEN_TILE_ROW_COUNT) {
        multiplier += 1;
        let tail = snake.SNAKE.pop();
        gameScreen.GAME_SCREEN_TILES[tail].classList.remove('snake');
        snake.SNAKE.unshift(1600 - (gameScreen.GAME_SCREEN_TILE_ROW_COUNT - snake.SNAKE[0] % gameScreen.GAME_SCREEN_TILE_ROW_COUNT) + (multiplier * snake.SNAKE_DIRECTION));
        gameScreen.GAME_SCREEN_TILES[snake.SNAKE[0]].classList.add('snake');
        snake.LOOPED = false;
    } else if (snake.SNAKE_DIRECTION === -1) {
      multiplier += 1;
      let tail = snake.SNAKE.pop();
      gameScreen.GAME_SCREEN_TILES[tail].classList.remove('snake');
      snake.SNAKE.unshift((Math.floor(snake.SNAKE[0] / 40) * 40) + (39 - (1 * multiplier)));
      gameScreen.GAME_SCREEN_TILES[snake.SNAKE[0]].classList.add('snake');
      snake.LOOPED = false;
    } else if (snake.SNAKE_DIRECTION === 1) {
      multiplier += 1;
      let tail = snake.SNAKE.pop();
      gameScreen.GAME_SCREEN_TILES[tail].classList.remove('snake');
      snake.SNAKE.unshift((Math.floor(snake.SNAKE[0] / 40) * 40) + (1 * multiplier));
      gameScreen.GAME_SCREEN_TILES[snake.SNAKE[0]].classList.add('snake');
      snake.LOOPED = false;
    }
  }

  if (snake.SNAKE[0] === snakeFood.FOOD_SPAWNPOINT) {
    collide();
    game.updateScore();
  }
}

function controlSnake(event) {
  switch (event.keyCode) {
    case 37:
      snake.SNAKE_DIRECTION = -1;
      break;
    case 65:
      snake.SNAKE_DIRECTION = -1;
      break;
    case 38:
      snake.SNAKE_DIRECTION = -gameScreen.GAME_SCREEN_TILE_ROW_COUNT;
      break;
    case 87:
      snake.SNAKE_DIRECTION = -gameScreen.GAME_SCREEN_TILE_ROW_COUNT;
      break;
    case 39:
      snake.SNAKE_DIRECTION = 1;
      break;
    case 68:
      snake.SNAKE_DIRECTION = 1;
      break;
    case 40:
      snake.SNAKE_DIRECTION = gameScreen.GAME_SCREEN_TILE_ROW_COUNT;
      break;
    case 83:
      snake.SNAKE_DIRECTION = gameScreen.GAME_SCREEN_TILE_ROW_COUNT;
      break;
  }
}

function spawnFood() {
  let spawnpoint;
  do {
    spawnpoint = Math.floor(Math.random() * gameScreen.GAME_SCREEN_TILES.length);
    snakeFood.FOOD_SPAWNPOINT = spawnpoint;
  } while (gameScreen.GAME_SCREEN_TILES[spawnpoint].classList.contains('snake'));
  gameScreen.GAME_SCREEN_TILES[spawnpoint].classList.add('food');
}

function growSnake() {
  const newBody = snake.SNAKE[snake.SNAKE.length - 1] + snake.SNAKE_DIRECTION;
  snake.SNAKE.push(newBody);
  gameScreen.GAME_SCREEN_TILES[newBody].classList.add('snake');
}

function collide(tail) {
  gameScreen.GAME_SCREEN_TILES[snakeFood.FOOD_SPAWNPOINT].classList.remove('food');
  growSnake();
  spawnFood();
}

function controlTitleScreen(event) {
  const options = [...gameScreen.TITLE_SCREEN_CONTROLS.children];
  switch (event.keyCode) {
    case 38:
      if (options[0].classList.contains('active')) {
        options[0].classList.remove('active');
        options[2].classList.add('active');
      } else {
        document.querySelector('.active').previousElementSibling.classList.add('active');
        document.querySelector('.active').nextElementSibling.classList.remove('active')
      }
      break;
    case 40:
      if (options[2].classList.contains('active')) {
        options[2].classList.remove('active');
        options[0].classList.add('active');
      } else {
        document.querySelector('.active').nextElementSibling.classList.add('active')
        document.querySelector('.active').classList.remove('active')
      }
      break;
    case 13:
      if (document.querySelector('.active').textContent === "Start game") {
        document.querySelector('.title-screen').style.display = "none";
        game.start();
        game.INTERVAL = setInterval(moveSnake, snake.SNAKE_SPEED);
      } else if (document.querySelector('.active').textContent === "Leaderboard") {
        document.querySelector('.leaderboard').style.display = "flex";
      }
      break;
  }
}
gameScreen.renderGrid();
document.addEventListener('keydown', controlTitleScreen)
document.querySelector('.back').addEventListener('click', function () {
  document.querySelector('.leaderboard').style.display = "none"
})

game.showLeaderBoard();