import { Snake } from './snake.js';
import { Food } from './food.js';
import { GhostSnake } from './ghost-snake.js';

export class Game {
    constructor(aiEngine, ui) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.aiEngine = aiEngine;
        this.ui = ui;
        
        this.gridSize = 20;
        this.tileCount = 30;
        this.canvas.width = this.gridSize * this.tileCount;
        this.canvas.height = this.gridSize * this.tileCount;
        
        this.state = 'waiting'; // waiting, playing, paused, gameOver
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.baseSpeed = 100;
        this.currentSpeed = this.baseSpeed;
        this.lastFrameTime = 0;
        this.gameLoopId = null;
        
        this.snake = null;
        this.food = null;
        this.ghostSnake = null;
        this.ghostEnabled = false;
        
        this.movementHistory = [];
        this.setupControls();
        this.ui.updateHighScore(this.highScore);
    }

    setupControls() {
        this.keys = {};
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.handleInput(e.key);
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    handleInput(key) {
        if (this.state !== 'playing') return;
        
        const direction = this.snake.direction;
        const newDirection = { ...direction };
        
        if ((key === 'ArrowUp' || key === 'w' || key === 'W') && direction.y === 0) {
            newDirection.x = 0;
            newDirection.y = -1;
        } else if ((key === 'ArrowDown' || key === 's' || key === 'S') && direction.y === 0) {
            newDirection.x = 0;
            newDirection.y = 1;
        } else if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && direction.x === 0) {
            newDirection.x = -1;
            newDirection.y = 0;
        } else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && direction.x === 0) {
            newDirection.x = 1;
            newDirection.y = 0;
        }
        
        if (newDirection.x !== direction.x || newDirection.y !== direction.y) {
            this.snake.direction = newDirection;
            this.recordMovement(newDirection);
        }
    }

    recordMovement(direction) {
        this.movementHistory.push({
            direction: { ...direction },
            position: { ...this.snake.body[0] },
            timestamp: Date.now()
        });
        
        if (this.movementHistory.length > 50) {
            this.movementHistory.shift();
        }
        
        this.aiEngine.recordMovement(this.movementHistory);
    }

    start() {
        this.state = 'playing';
        this.score = 0;
        this.currentSpeed = this.baseSpeed;
        
        const center = Math.floor(this.tileCount / 2);
        this.snake = new Snake(center, center, this.gridSize);
        this.food = new Food(this.tileCount, this.gridSize);
        this.food.spawn(this.snake.body);
        
        if (this.ghostEnabled) {
            this.ghostSnake = new GhostSnake(center - 5, center, this.gridSize, this.aiEngine);
        }
        
        this.ui.hideOverlay();
        this.ui.updateScore(this.score);
        this.updateSpeedDisplay();
        
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        if (this.state !== 'playing') return;
        
        const deltaTime = currentTime - this.lastFrameTime;
        
        if (deltaTime >= this.currentSpeed) {
            this.update();
            this.render();
            this.lastFrameTime = currentTime;
        }
        
        this.gameLoopId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    update() {
        // Update snake
        this.snake.move();
        
        // Check wall collision
        if (this.checkWallCollision(this.snake.body[0])) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.checkSelfCollision()) {
            this.gameOver();
            return;
        }
        
        // Check food collision
        if (this.checkFoodCollision()) {
            this.snake.grow();
            this.score += 10;
            this.ui.updateScore(this.score);
            
            // Adaptive difficulty
            this.adjustDifficulty();
            
            // AI-powered food placement
            const prediction = this.aiEngine.predictNextPosition(this.snake);
            this.food.spawnSmart(this.snake.body, prediction, this.tileCount);
            
            // Update AI insights
            this.updateAIInsights();
        }
        
        // Update ghost snake
        if (this.ghostEnabled && this.ghostSnake) {
            this.ghostSnake.update(this.snake, this.food);
            
            // Check ghost collision with food
            if (this.checkCollision(this.ghostSnake.body[0], this.food.position)) {
                this.food.spawn(this.snake.body.concat(this.ghostSnake.body));
            }
        }
    }

    adjustDifficulty() {
        const skillLevel = this.aiEngine.analyzeSkillLevel(this.score, this.movementHistory);
        this.currentSpeed = Math.max(50, this.baseSpeed - (skillLevel * 10));
        this.updateSpeedDisplay();
        this.ui.updateAILevel(skillLevel);
    }

    updateAIInsights() {
        const pattern = this.aiEngine.getMovementPattern();
        const accuracy = this.aiEngine.getPredictionAccuracy();
        const strategy = this.aiEngine.getFoodStrategy();
        
        this.ui.updateAIPattern(pattern);
        this.ui.updateAIAccuracy(accuracy);
        this.ui.updateFoodStrategy(strategy);
    }

    checkWallCollision(position) {
        return position.x < 0 || position.x >= this.tileCount ||
               position.y < 0 || position.y >= this.tileCount;
    }

    checkSelfCollision() {
        const head = this.snake.body[0];
        for (let i = 1; i < this.snake.body.length; i++) {
            if (head.x === this.snake.body[i].x && head.y === this.snake.body[i].y) {
                return true;
            }
        }
        return false;
    }

    checkFoodCollision() {
        return this.checkCollision(this.snake.body[0], this.food.position);
    }

    checkCollision(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw prediction path
        if (this.movementHistory.length > 3) {
            this.drawPredictionPath();
        }
        
        // Draw food
        this.food.draw(this.ctx);
        
        // Draw ghost snake
        if (this.ghostEnabled && this.ghostSnake) {
            this.ghostSnake.draw(this.ctx);
        }
        
        // Draw snake
        this.snake.draw(this.ctx);
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }

    drawPredictionPath() {
        const predictions = this.aiEngine.predictPath(this.snake, 5);
        
        predictions.forEach((pos, index) => {
            const alpha = 0.3 - (index * 0.05);
            this.ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`;
            this.ctx.fillRect(
                pos.x * this.gridSize + 2,
                pos.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );
        });
    }

    updateSpeedDisplay() {
        const speedMultiplier = (this.baseSpeed / this.currentSpeed).toFixed(1);
        this.ui.updateSpeed(speedMultiplier);
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            cancelAnimationFrame(this.gameLoopId);
            this.ui.showOverlay('Paused', 'Press SPACE to continue');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            this.ui.hideOverlay();
            this.lastFrameTime = performance.now();
            this.gameLoop();
        }
    }

    toggleGhostAI() {
        this.ghostEnabled = !this.ghostEnabled;
        this.ui.updateGhostStatus(this.ghostEnabled);
        
        if (this.ghostEnabled && this.state === 'playing' && !this.ghostSnake) {
            const center = Math.floor(this.tileCount / 2);
            this.ghostSnake = new GhostSnake(center - 5, center, this.gridSize, this.aiEngine);
        }
    }

    restart() {
        cancelAnimationFrame(this.gameLoopId);
        this.start();
    }

    gameOver() {
        this.state = 'gameOver';
        cancelAnimationFrame(this.gameLoopId);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.ui.updateHighScore(this.highScore);
        }
        
        this.ui.showOverlay('Game Over!', `Score: ${this.score} | Press SPACE to restart`);
    }
}
