---
inclusion: always
---

# AI Snake Project - Development Guidelines

## Project Context
This is an AI-enhanced Snake game built for Week 4 Challenge - Retro Revival. The project combines classic gameplay with modern machine learning features.

## Architecture Principles
- **Modular Design**: Each component (Snake, Food, AI Engine, UI) is a separate class
- **Clean Separation**: Game logic, rendering, and AI are clearly separated
- **ES6 Modules**: Use import/export for clean dependencies
- **Event-Driven**: UI updates through event system

## AI Integration Guidelines
- **Fallback Mechanisms**: Always provide non-ML alternatives
- **Performance First**: AI should enhance, not hinder gameplay
- **Transparency**: Make AI decisions visible to users
- **Adaptability**: AI should learn and adjust to player behavior

## Code Standards
- Use descriptive variable and function names
- Comment complex algorithms and AI logic
- Handle edge cases gracefully
- Maintain consistent code formatting
- Follow ES6+ best practices

## Testing Approach
- Test in multiple browsers
- Verify AI features work correctly
- Ensure smooth 60fps performance
- Validate responsive design
- Check accessibility features

## File Organization
```
js/
├── main.js         # Entry point and initialization
├── game.js         # Core game loop and logic
├── snake.js        # Player snake mechanics
├── ghost-snake.js  # AI opponent
├── food.js         # Food spawning and rendering
├── ai-engine.js    # ML and AI algorithms
└── ui.js           # User interface management
```