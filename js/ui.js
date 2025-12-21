export class UI {
    constructor() {
        this.overlay = document.getElementById('gameOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.speedElement = document.getElementById('speed');
        this.aiLevelElement = document.getElementById('aiLevel');
        
        this.aiPatternElement = document.getElementById('aiPattern');
        this.aiAccuracyElement = document.getElementById('aiAccuracy');
        this.ghostStatusElement = document.getElementById('ghostStatus');
        this.foodStrategyElement = document.getElementById('foodStrategy');
    }

    showOverlay(title, message) {
        this.overlayTitle.textContent = title;
        this.overlayMessage.textContent = message;
        this.overlay.classList.remove('hidden');
    }

    hideOverlay() {
        this.overlay.classList.add('hidden');
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
        this.animateElement(this.scoreElement);
    }

    updateHighScore(highScore) {
        this.highScoreElement.textContent = highScore;
    }

    updateSpeed(speed) {
        this.speedElement.textContent = speed + 'x';
    }

    updateAILevel(level) {
        this.aiLevelElement.textContent = level;
        this.animateElement(this.aiLevelElement);
    }

    updateAIPattern(pattern) {
        this.aiPatternElement.textContent = pattern;
    }

    updateAIAccuracy(accuracy) {
        this.aiAccuracyElement.textContent = accuracy + '%';
    }

    updateGhostStatus(enabled) {
        this.ghostStatusElement.textContent = enabled ? 'Active' : 'Disabled';
        this.ghostStatusElement.style.color = enabled ? '#4ade80' : '#ef4444';
    }

    updateFoodStrategy(strategy) {
        this.foodStrategyElement.textContent = strategy;
    }

    updateAIStatus(status) {
        // This could be used for loading states
        console.log('AI Status:', status);
    }

    animateElement(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
}