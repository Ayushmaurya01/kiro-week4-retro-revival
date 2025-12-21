import { Game } from './game.js';
import { AIEngine } from './ai-engine.js';
import { UI } from './ui.js';

class App {
    constructor() {
        this.game = null;
        this.aiEngine = null;
        this.ui = null;
        this.init();
    }

    async init() {
        // Initialize UI
        this.ui = new UI();
        
        // Initialize AI Engine
        this.ui.updateAIStatus('Initializing AI...');
        this.aiEngine = new AIEngine();
        await this.aiEngine.initialize();
        this.ui.updateAIStatus('Ready');
        
        // Initialize Game
        this.game = new Game(this.aiEngine, this.ui);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show start screen
        this.ui.showOverlay('AI Snake', 'Press SPACE or click Start to begin');
    }

    setupEventListeners() {
        // Start button
        document.getElementById('startButton').addEventListener('click', () => {
            this.game.start();
        });

        // Pause button
        document.getElementById('pauseButton').addEventListener('click', () => {
            this.game.togglePause();
        });

        // Restart button
        document.getElementById('restartButton').addEventListener('click', () => {
            this.game.restart();
        });

        // Ghost AI toggle
        document.getElementById('ghostToggle').addEventListener('click', () => {
            this.game.toggleGhostAI();
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.game.state === 'waiting') {
                    this.game.start();
                } else if (this.game.state === 'playing') {
                    this.game.togglePause();
                }
            } else if (e.key.toLowerCase() === 'g') {
                this.game.toggleGhostAI();
            }
        });
    }
}

// Start the application
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
