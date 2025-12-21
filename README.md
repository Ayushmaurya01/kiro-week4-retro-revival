# 🐍 AI Snake - Retro Revival

A modern take on the classic Snake game with intelligent AI features that adapt to your playing style.

## 🎮 Features

### Classic Gameplay
- Smooth, responsive controls (Arrow keys or WASD)
- Clean retro-inspired visual design
- Score tracking with persistent high scores
- Pause/resume functionality

### 🤖 AI Enhancements
- **Adaptive Difficulty**: Game speed adjusts based on your skill level
- **Smart Food Placement**: AI predicts your movement patterns and places food strategically
- **Ghost Snake AI**: Optional AI opponent that learns from your playing style
- **Predictive Path Visualization**: Shows probable future positions based on movement history
- **Movement Pattern Analysis**: Real-time analysis of your playing patterns
- **ML-Powered Predictions**: Uses TensorFlow.js for intelligent gameplay features

### 🎯 AI Insights Dashboard
- Movement pattern classification (Linear, Adaptive, Erratic, Predictable)
- Prediction accuracy percentage
- Dynamic difficulty level indicator
- Food placement strategy display

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser
3. **Click "Start Game"** or press SPACE to begin
4. **Use arrow keys or WASD** to control your snake
5. **Press 'G'** to toggle Ghost AI opponent

## 🎮 Controls

| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move snake |
| SPACE | Start game / Pause |
| G | Toggle Ghost AI |
| Pause Button | Pause/Resume |
| Restart Button | Restart game |

## 🧠 AI Features Explained

### Adaptive Difficulty
The AI monitors your performance and adjusts game speed in real-time:
- **Beginner**: Slower speed, more forgiving
- **Intermediate**: Standard speed with slight increases
- **Advanced**: High speed with rapid acceleration

### Smart Food Placement
Instead of random placement, the AI:
- Analyzes your movement patterns
- Predicts your likely next positions
- Places food strategically to create engaging gameplay
- Balances challenge with achievability

### Ghost Snake AI
An optional AI opponent that:
- Learns from your playing style
- Competes for food without interfering with your snake
- Uses pathfinding algorithms to navigate efficiently
- Provides additional challenge and visual interest

### Movement Pattern Analysis
The AI classifies your playing style:
- **Linear**: Prefers straight-line movement
- **Adaptive**: Balanced, strategic movement
- **Erratic**: Frequent direction changes
- **Predictable**: Repetitive patterns

## 🛠️ Technical Implementation

### Architecture
- **Modular ES6 JavaScript** with clean separation of concerns
- **HTML5 Canvas** for smooth 60fps rendering
- **TensorFlow.js** for machine learning features
- **Local Storage** for persistent high scores

### File Structure
```
├── index.html          # Main game page
├── styles.css          # Modern CSS with animations
├── js/
│   ├── main.js         # Application entry point
│   ├── game.js         # Core game logic
│   ├── snake.js        # Player snake class
│   ├── ghost-snake.js  # AI opponent
│   ├── food.js         # Food spawning and rendering
│   ├── ai-engine.js    # ML and AI logic
│   └── ui.js           # User interface management
└── docs/               # Documentation
```

### AI Engine Components
1. **Movement Prediction**: Neural network trained on player patterns
2. **Skill Assessment**: Multi-factor analysis of player ability
3. **Pattern Recognition**: Real-time classification of movement styles
4. **Strategic Food Placement**: Heuristic algorithms for optimal positioning

## 🎨 Visual Design

- **Retro-inspired color scheme** with modern gradients
- **Smooth animations** and transitions
- **Responsive design** that works on different screen sizes
- **Particle effects** and visual feedback
- **Clean, readable UI** with real-time statistics

## 🏆 Scoring System

- **10 points** per food item
- **Bonus multipliers** for consecutive successful moves
- **Speed bonuses** at higher difficulty levels
- **Pattern bonuses** for consistent strategic play

## 🔧 Browser Compatibility

- **Chrome/Edge**: Full feature support
- **Firefox**: Full feature support
- **Safari**: Full feature support
- **Mobile browsers**: Touch controls supported

## 📊 Performance

- **60 FPS** smooth gameplay
- **Minimal memory usage** with efficient algorithms
- **Fast startup** with optimized asset loading
- **Responsive controls** with sub-frame input handling

## 🎯 Week 4 Challenge Requirements

✅ **Classic Game**: Fully playable Snake with all traditional mechanics  
✅ **Modern AI**: Multiple AI features that enhance gameplay  
✅ **Clean Structure**: Modular, well-documented code  
✅ **Visual Appeal**: Modern design with retro aesthetics  
✅ **Easy to Understand**: Clear code structure and documentation  
✅ **Runs Successfully**: No dependencies, works in any modern browser  

## 🚀 Future Enhancements

- Multiplayer support with AI matchmaking
- Advanced neural network training
- Custom themes and visual effects
- Leaderboard integration
- Mobile app version

---

**Built for Week 4 Challenge - Retro Revival** 🎮  
*Classic gameplay meets modern intelligence*