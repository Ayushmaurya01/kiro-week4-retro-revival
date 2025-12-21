export class Food {
    constructor(tileCount, gridSize) {
        this.tileCount = tileCount;
        this.gridSize = gridSize;
        this.position = { x: 0, y: 0 };
        this.type = 'normal'; // normal, bonus, special
        this.spawnTime = Date.now();
        this.pulsePhase = 0;
    }

    spawn(snakeBody) {
        do {
            this.position = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.isPositionOccupied(this.position, snakeBody));
        
        this.spawnTime = Date.now();
        this.type = Math.random() < 0.1 ? 'bonus' : 'normal';
    }

    spawnSmart(snakeBody, prediction, tileCount) {
        const candidates = [];
        const head = snakeBody[0];
        
        // Generate candidate positions
        for (let x = 0; x < tileCount; x++) {
            for (let y = 0; y < tileCount; y++) {
                const pos = { x, y };
                if (!this.isPositionOccupied(pos, snakeBody)) {
                    const distance = Math.abs(pos.x - head.x) + Math.abs(pos.y - head.y);
                    const predictedDistance = prediction ? 
                        Math.abs(pos.x - prediction.x) + Math.abs(pos.y - prediction.y) : distance;
                    
                    candidates.push({
                        position: pos,
                        distance,
                        predictedDistance,
                        score: this.calculatePositionScore(pos, head, prediction, distance)
                    });
                }
            }
        }
        
        // Sort by score and pick from top candidates
        candidates.sort((a, b) => b.score - a.score);
        const topCandidates = candidates.slice(0, Math.min(10, candidates.length));
        const chosen = topCandidates[Math.floor(Math.random() * topCandidates.length)];
        
        this.position = chosen.position;
        this.spawnTime = Date.now();
        this.type = Math.random() < 0.15 ? 'bonus' : 'normal';
    }

    calculatePositionScore(pos, head, prediction, distance) {
        let score = 0;
        
        // Prefer medium distances (not too close, not too far)
        const idealDistance = 8;
        score += Math.max(0, 10 - Math.abs(distance - idealDistance));
        
        // If we have prediction, consider it
        if (prediction) {
            const predDistance = Math.abs(pos.x - prediction.x) + Math.abs(pos.y - prediction.y);
            score += Math.max(0, 5 - predDistance * 0.5);
        }
        
        // Avoid corners and edges slightly
        const edgeDistance = Math.min(pos.x, pos.y, this.tileCount - 1 - pos.x, this.tileCount - 1 - pos.y);
        score += edgeDistance * 0.5;
        
        return score;
    }

    isPositionOccupied(position, snakeBody) {
        return snakeBody.some(segment => 
            segment.x === position.x && segment.y === position.y
        );
    }

    draw(ctx) {
        this.pulsePhase += 0.1;
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
        
        if (this.type === 'bonus') {
            // Bonus food - golden with sparkle effect
            ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
            ctx.fillRect(
                this.position.x * this.gridSize - 2,
                this.position.y * this.gridSize - 2,
                this.gridSize + 4,
                this.gridSize + 4
            );
            
            // Inner glow
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(
                this.position.x * this.gridSize + 2,
                this.position.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );
        } else {
            // Normal food - red apple-like
            ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
            ctx.fillRect(
                this.position.x * this.gridSize,
                this.position.y * this.gridSize,
                this.gridSize,
                this.gridSize
            );
            
            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(
                this.position.x * this.gridSize + 2,
                this.position.y * this.gridSize + 2,
                this.gridSize / 3,
                this.gridSize / 3
            );
        }
    }
}