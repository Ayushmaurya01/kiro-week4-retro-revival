export class GhostSnake {
    constructor(x, y, gridSize, aiEngine) {
        this.gridSize = gridSize;
        this.body = [{ x, y }];
        this.direction = { x: 1, y: 0 };
        this.aiEngine = aiEngine;
        this.moveCounter = 0;
        this.alpha = 0.6;
        this.growing = false;
    }

    update(playerSnake, food) {
        this.moveCounter++;
        
        // Move every other frame to make it slightly slower
        if (this.moveCounter % 2 === 0) {
            this.makeAIMove(playerSnake, food);
            this.move();
        }
    }

    makeAIMove(playerSnake, food) {
        const head = this.body[0];
        const possibleMoves = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
        ];

        // Filter out moves that would cause collision with walls or self
        const validMoves = possibleMoves.filter(move => {
            const newPos = {
                x: head.x + move.x,
                y: head.y + move.y
            };
            
            // Check wall collision
            if (newPos.x < 0 || newPos.x >= 30 || newPos.y < 0 || newPos.y >= 30) {
                return false;
            }
            
            // Check self collision
            if (this.body.some(segment => segment.x === newPos.x && segment.y === newPos.y)) {
                return false;
            }
            
            // Don't reverse direction
            if (move.x === -this.direction.x && move.y === -this.direction.y) {
                return false;
            }
            
            return true;
        });

        if (validMoves.length === 0) {
            return; // No valid moves, stay in current direction
        }

        // AI decision making
        let bestMove = validMoves[0];
        let bestScore = -Infinity;

        validMoves.forEach(move => {
            const newPos = {
                x: head.x + move.x,
                y: head.y + move.y
            };
            
            let score = 0;
            
            // Distance to food (closer is better)
            const foodDistance = Math.abs(newPos.x - food.position.x) + Math.abs(newPos.y - food.position.y);
            score += (30 - foodDistance) * 2;
            
            // Avoid player snake
            const playerDistance = Math.min(...playerSnake.body.map(segment => 
                Math.abs(newPos.x - segment.x) + Math.abs(newPos.y - segment.y)
            ));
            if (playerDistance < 3) {
                score -= 50;
            }
            
            // Prefer continuing in same direction (smoother movement)
            if (move.x === this.direction.x && move.y === this.direction.y) {
                score += 5;
            }
            
            // Avoid edges
            const edgeDistance = Math.min(newPos.x, newPos.y, 29 - newPos.x, 29 - newPos.y);
            score += edgeDistance;
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        });

        this.direction = bestMove;
    }

    move() {
        const head = { ...this.body[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        this.body.unshift(head);
        
        if (!this.growing) {
            this.body.pop();
        } else {
            this.growing = false;
        }
    }

    grow() {
        this.growing = true;
    }

    draw(ctx) {
        this.body.forEach((segment, index) => {
            const segmentAlpha = this.alpha * (1 - index * 0.1);
            
            if (index === 0) {
                // Ghost head
                ctx.fillStyle = `rgba(147, 51, 234, ${segmentAlpha})`;
                ctx.fillRect(
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    this.gridSize,
                    this.gridSize
                );
                
                // Ghost eyes
                ctx.fillStyle = `rgba(255, 255, 255, ${segmentAlpha})`;
                const eyeSize = 3;
                const eyeOffset = 5;
                ctx.fillRect(
                    segment.x * this.gridSize + eyeOffset,
                    segment.y * this.gridSize + eyeOffset,
                    eyeSize,
                    eyeSize
                );
                ctx.fillRect(
                    segment.x * this.gridSize + this.gridSize - eyeOffset - eyeSize,
                    segment.y * this.gridSize + eyeOffset,
                    eyeSize,
                    eyeSize
                );
            } else {
                // Ghost body
                ctx.fillStyle = `rgba(147, 51, 234, ${Math.max(segmentAlpha, 0.1)})`;
                ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            }
        });
    }
}