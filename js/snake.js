export class Snake {
    constructor(x, y, gridSize) {
        this.gridSize = gridSize;
        this.body = [{ x, y }];
        this.direction = { x: 1, y: 0 };
        this.growing = false;
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
            if (index === 0) {
                // Head - brighter and with eyes
                ctx.fillStyle = '#4ade80';
                ctx.fillRect(
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    this.gridSize,
                    this.gridSize
                );
                
                // Eyes
                ctx.fillStyle = '#1a1a2e';
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
                // Body - gradient effect
                const alpha = 1 - (index * 0.05);
                ctx.fillStyle = `rgba(34, 197, 94, ${Math.max(alpha, 0.3)})`;
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