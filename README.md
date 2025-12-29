# **RL Learning Lab - Interactive Visualizer**

A simple web tool to visualize and experiment with Reinforcement Learning.

## **Features**
- 5 different learning environments
- 8 RL algorithms
- Interactive visual interface
- Real-time training and testing
- Adjust all parameters

## **Available Environments**
1. **GridWorld** - 5×5 grid with obstacles
2. **Frozen Lake** - Slippery ice grid
3. **CartPole** - Balance a pole on a cart
4. **Mountain Car** - Drive up a hill
5. **Breakout** - Simple brick-breaking game

## **Algorithms**
### **Dynamic Programming**
- Policy Evaluation
- Policy Iteration
- Value Iteration

### **Model-Free Methods**
- Monte Carlo
- TD(0)
- n-step TD
- SARSA
- Q-Learning

## **How to Run**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Start the App**
```bash
npm start
```

### **3. Open Browser**
```
http://localhost:3000
```

## **How to Use**
1. Choose an environment
2. Select an algorithm
3. Adjust parameters:
   - γ (gamma): Discount factor
   - α (alpha): Learning rate
   - ε (epsilon): Exploration rate
   - Episodes: Training episodes
4. Click "Train" to start training
5. Click "Inference" to see results

## **Visual Features**
- Heat map of state values
- Arrows showing optimal policy
- Training progress charts
- Real-time parameter updates
- Customizable rewards

## **Project Structure**
```
src/
├── environments/    # Environment files
├── algorithms/      # Algorithm files
├── components/      # UI components
├── styles/         # Styles
└── App.js          # Main file
```

## **Requirements**
- Node.js 14 or higher
- npm 
