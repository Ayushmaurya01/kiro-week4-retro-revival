export class AIEngine {
    constructor() {
        this.model = null;
        this.movementHistory = [];
        this.predictions = [];
        this.accuracy = 0;
        this.skillLevel = 1;
        this.movementPattern = 'Random';
        this.foodStrategy = 'Adaptive';
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Create a simple neural network for movement prediction
            this.model = tf.sequential({
                layers: [
                    tf.layers.dense({ inputShape: [6], units: 16, activation: 'relu' }),
                    tf.layers.dense({ units: 8, activation: 'relu' }),
                    tf.layers.dense({ units: 4, activation: 'softmax' }) // 4 directions
                ]
            });

            this.model.compile({
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            this.isInitialized = true;
        } catch (error) {
            console.warn('TensorFlow.js not available, using fallback AI');
            this.isInitialized = false;
        }
    }

    recordMovement(movementHistory) {
        this.movementHistory = [...movementHistory];
        this.analyzeMovementPattern();
        this.updatePredictionAccuracy();
    }

    analyzeMovementPattern() {
        if (this.movementHistory.length < 5) {
            this.movementPattern = 'Learning...';
            return;
        }

        const recent = this.movementHistory.slice(-10);
        const directions = recent.map(m => `${m.direction.x},${m.direction.y}`);
        
        // Analyze patterns
        const uniqueDirections = new Set(directions).size;
        const reversals = this.countReversals(recent);
        const straightMoves = this.countStraightMoves(recent);

        if (straightMoves > 6) {
            this.movementPattern = 'Linear';
        } else if (reversals > 3) {
            this.movementPattern = 'Erratic';
        } else if (uniqueDirections <= 2) {
            this.movementPattern = 'Predictable';
        } else {
            this.movementPattern = 'Adaptive';
        }
    }

    countReversals(movements) {
        let reversals = 0;
        for (let i = 1; i < movements.length; i++) {
            const prev = movements[i - 1].direction;
            const curr = movements[i].direction;
            if (prev.x === -curr.x && prev.y === -curr.y) {
                reversals++;
            }
        }
        return reversals;
    }

    countStraightMoves(movements) {
        let straight = 0;
        let currentDirection = null;
        let currentStreak = 0;

        movements.forEach(move => {
            const dir = `${move.direction.x},${move.direction.y}`;
            if (dir === currentDirection) {
                currentStreak++;
            } else {
                straight = Math.max(straight, currentStreak);
                currentDirection = dir;
                currentStreak = 1;
            }
        });

        return Math.max(straight, currentStreak);
    }

    predictNextPosition(snake) {
        if (this.movementHistory.length < 3) {
            return this.fallbackPrediction(snake);
        }

        if (this.isInitialized && this.model) {
            return this.mlPrediction(snake);
        } else {
            return this.heuristicPrediction(snake);
        }
    }

    mlPrediction(snake) {
        try {
            const head = snake.body[0];
            const direction = snake.direction;
            const recent = this.movementHistory.slice(-3);
            
            // Create input features
            const features = [
                head.x / 30, // normalized position
                head.y / 30,
                direction.x,
                direction.y,
                recent.length > 0 ? recent[recent.length - 1].direction.x : 0,
                recent.length > 0 ? recent[recent.length - 1].direction.y : 0
            ];

            const prediction = this.model.predict(tf.tensor2d([features]));
            const probabilities = prediction.dataSync();
            
            // Convert probabilities to direction
            const directions = [
                { x: 0, y: -1 }, // up
                { x: 0, y: 1 },  // down
                { x: -1, y: 0 }, // left
                { x: 1, y: 0 }   // right
            ];

            const maxIndex = probabilities.indexOf(Math.max(...probabilities));
            const predictedDirection = directions[maxIndex];

            return {
                x: head.x + predictedDirection.x,
                y: head.y + predictedDirection.y
            };
        } catch (error) {
            return this.fallbackPrediction(snake);
        }
    }

    heuristicPrediction(snake) {
        const head = snake.body[0];
        const direction = snake.direction;
        
        // Analyze recent movement patterns
        const recent = this.movementHistory.slice(-5);
        const directionChanges = recent.filter((move, i) => {
            if (i === 0) return false;
            const prev = recent[i - 1].direction;
            return move.direction.x !== prev.x || move.direction.y !== prev.y;
        });

        // If player changes direction frequently, predict a turn
        if (directionChanges.length > 2) {
            const possibleTurns = [
                { x: -direction.y, y: direction.x }, // turn left
                { x: direction.y, y: -direction.x }  // turn right
            ];
            const turn = possibleTurns[Math.floor(Math.random() * 2)];
            return {
                x: head.x + turn.x,
                y: head.y + turn.y
            };
        }

        // Otherwise predict straight movement
        return {
            x: head.x + direction.x,
            y: head.y + direction.y
        };
    }

    fallbackPrediction(snake) {
        const head = snake.body[0];
        const direction = snake.direction;
        return {
            x: head.x + direction.x,
            y: head.y + direction.y
        };
    }

    predictPath(snake, steps) {
        const path = [];
        let currentPos = { ...snake.body[0] };
        let currentDir = { ...snake.direction };

        for (let i = 0; i < steps; i++) {
            currentPos.x += currentDir.x;
            currentPos.y += currentDir.y;
            
            // Bound check
            if (currentPos.x < 0 || currentPos.x >= 30 || 
                currentPos.y < 0 || currentPos.y >= 30) {
                break;
            }
            
            path.push({ ...currentPos });
            
            // Occasionally predict direction changes
            if (Math.random() < 0.2 && this.movementPattern === 'Adaptive') {
                const turns = [
                    { x: -currentDir.y, y: currentDir.x },
                    { x: currentDir.y, y: -currentDir.x }
                ];
                currentDir = turns[Math.floor(Math.random() * 2)];
            }
        }

        return path;
    }

    analyzeSkillLevel(score, movementHistory) {
        let skillScore = 0;
        
        // Score-based skill
        skillScore += Math.min(score / 50, 5);
        
        // Movement efficiency
        if (movementHistory.length > 10) {
            const efficiency = this.calculateMovementEfficiency(movementHistory);
            skillScore += efficiency * 3;
        }
        
        // Pattern complexity
        const patternComplexity = this.getPatternComplexity();
        skillScore += patternComplexity;
        
        this.skillLevel = Math.max(1, Math.min(10, Math.round(skillScore)));
        return this.skillLevel;
    }

    calculateMovementEfficiency(history) {
        if (history.length < 5) return 0;
        
        const recent = history.slice(-10);
        const totalMoves = recent.length;
        const uniquePositions = new Set(
            recent.map(m => `${m.position.x},${m.position.y}`)
        ).size;
        
        return uniquePositions / totalMoves;
    }

    getPatternComplexity() {
        switch (this.movementPattern) {
            case 'Linear': return 1;
            case 'Predictable': return 2;
            case 'Adaptive': return 4;
            case 'Erratic': return 3;
            default: return 1;
        }
    }

    updatePredictionAccuracy() {
        // Simulate accuracy based on pattern recognition
        const baseAccuracy = 60;
        const patternBonus = this.getPatternComplexity() * 5;
        const historyBonus = Math.min(this.movementHistory.length, 20);
        
        this.accuracy = Math.min(95, baseAccuracy + patternBonus + historyBonus);
    }

    getMovementPattern() {
        return this.movementPattern;
    }

    getPredictionAccuracy() {
        return Math.round(this.accuracy);
    }

    getFoodStrategy() {
        return this.foodStrategy;
    }
}