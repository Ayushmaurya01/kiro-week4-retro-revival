---
inclusion: fileMatch
fileMatchPattern: "*ai*"
---

# AI Features Implementation Guide

## Core AI Components

### Movement Prediction
- Uses TensorFlow.js neural network when available
- Fallback to heuristic algorithms
- Input: position, direction, movement history
- Output: predicted next positions

### Adaptive Difficulty
- Analyzes player skill in real-time
- Factors: score, movement efficiency, pattern complexity
- Adjusts game speed dynamically
- Range: 1x to 3x speed multiplier

### Pattern Recognition
- Classifies movement patterns:
  - Linear: Prefers straight lines
  - Adaptive: Balanced strategic movement
  - Erratic: Frequent direction changes
  - Predictable: Repetitive patterns

### Smart Food Placement
- Considers player position and predicted path
- Balances challenge with achievability
- Uses scoring algorithm for position selection
- Avoids purely random placement

## Implementation Notes

### Neural Network Architecture
```javascript
tf.sequential({
    layers: [
        tf.layers.dense({ inputShape: [6], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
    ]
});
```

### Feature Engineering
- Normalize positions to 0-1 range
- Include direction vectors
- Consider movement history
- Time-based features for pattern analysis

### Performance Optimization
- Limit history buffer size
- Use efficient data structures
- Minimize ML computations per frame
- Cache predictions when possible