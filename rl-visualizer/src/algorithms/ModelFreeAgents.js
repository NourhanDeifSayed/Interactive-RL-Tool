import React from 'react';

export class BaseAgent {
  constructor(env, alpha = 0.1, gamma = 0.9, epsilon = 0.1) {
    this.env = env;
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.qTable = Array(env.nStates).fill(0).map(() => Array(env.nActions).fill(0));
    this.episodeReturns = [];
    this.stepCount = 0;
  }

  chooseAction(state) {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.env.nActions);
    }
    const qValues = this.qTable[state];
    
    if (!qValues || !Array.isArray(qValues) || qValues.length === 0) {
      return Math.floor(Math.random() * this.env.nActions);
    }
    
    const safeQValues = qValues.map(q => isFinite(q) ? q : 0);
    const maxQ = Math.max(...safeQValues);
    
    if (!isFinite(maxQ)) {
      return Math.floor(Math.random() * this.env.nActions);
    }
    
    const bestActions = safeQValues.map((q, idx) => Math.abs(q - maxQ) < 0.0001 ? idx : -1).filter(idx => idx !== -1);
    return bestActions[Math.floor(Math.random() * bestActions.length)];
  }

  getPolicy() {
    return this.qTable.map(q => {
      const safeQ = q.map(val => isFinite(val) ? val : -Infinity);
      const maxQ = Math.max(...safeQ);
      
      if (!isFinite(maxQ)) {
        return Math.floor(Math.random() * this.env.nActions);
      }
      
      const bestActions = safeQ.map((value, idx) => Math.abs(value - maxQ) < 0.0001 ? idx : -1).filter(idx => idx !== -1);
      return bestActions[Math.floor(Math.random() * bestActions.length)];
    });
  }

  getValues() {
    return this.qTable.map(q => {
      const safeQ = q.map(val => isFinite(val) ? val : -Infinity);
      const maxQ = Math.max(...safeQ);
      return isFinite(maxQ) ? maxQ : 0;
    });
  }

  getMetrics() {
    return {
      episodeReturns: this.episodeReturns,
      stepCount: this.stepCount,
      latestReturn: this.episodeReturns.length > 0 ? this.episodeReturns[this.episodeReturns.length - 1] : 0
    };
  }
}

export class QLearning extends BaseAgent {
  constructor(env, alpha = 0.1, gamma = 0.9, epsilon = 0.1) {
    super(env, alpha, gamma, epsilon);
  }

  trainStep(state, action, nextState, reward, done) {
    if (state === undefined || action === undefined || nextState === undefined) {
      return 0;
    }
    
    if (!this.qTable[state] || !this.qTable[nextState]) {
      return 0;
    }
    
    let maxNextQ = -Infinity;
    if (this.qTable[nextState]) {
      const safeQValues = this.qTable[nextState].map(q => isFinite(q) ? q : -Infinity);
      maxNextQ = Math.max(...safeQValues);
    }
    
    if (!isFinite(maxNextQ)) {
      maxNextQ = 0;
    }
    
    const target = reward + (done ? 0 : this.gamma * maxNextQ);
    const currentQ = this.qTable[state][action];
    
    if (isFinite(target) && isFinite(currentQ)) {
      this.qTable[state][action] += this.alpha * (target - currentQ);
      this.stepCount++;
      return target - currentQ;
    }
    
    return 0;
  }

  trainEpisode() {
    let state = this.env.reset();
    let done = false;
    let totalReward = 0;
    let steps = 0;
    
    while (!done && steps < 1000) {
      const action = this.chooseAction(state);
      const stepResult = this.env.step(action);
      
      if (!stepResult) {
        break;
      }
      
      const { state: nextState, reward, done: isDone } = stepResult;
      
      if (nextState === undefined) {
        break;
      }
      
      this.trainStep(state, action, nextState, reward, isDone);
      
      state = nextState;
      done = isDone;
      totalReward += reward;
      steps++;
    }
    
    this.episodeReturns.push(totalReward);
    return totalReward;
  }

  train(episodes = 100) {
    for (let ep = 0; ep < episodes; ep++) {
      this.trainEpisode();
    }
  }
}

export class SARSA extends BaseAgent {
  constructor(env, alpha = 0.1, gamma = 0.9, epsilon = 0.1) {
    super(env, alpha, gamma, epsilon);
  }

  trainEpisode() {
    let state = this.env.reset();
    let action = this.chooseAction(state);
    let done = false;
    let totalReward = 0;
    let steps = 0;
    
    while (!done && steps < 1000) {
      const stepResult = this.env.step(action);
      if (!stepResult) break;
      
      const { state: nextState, reward, done: isDone } = stepResult;
      
      if (nextState === undefined) break;
      
      const nextAction = this.chooseAction(nextState);
      
      const target = reward + (isDone ? 0 : this.gamma * this.qTable[nextState][nextAction]);
      const currentQ = this.qTable[state][action];
      
      if (isFinite(target) && isFinite(currentQ)) {
        this.qTable[state][action] += this.alpha * (target - currentQ);
      }
      
      state = nextState;
      action = nextAction;
      done = isDone;
      totalReward += reward;
      steps++;
      this.stepCount++;
    }
    
    this.episodeReturns.push(totalReward);
    return totalReward;
  }

  train(episodes = 100) {
    for (let ep = 0; ep < episodes; ep++) {
      this.trainEpisode();
    }
  }
}

export class MonteCarlo extends BaseAgent {
  constructor(env, gamma = 0.9, epsilon = 0.1, firstVisit = true) {
    super(env, 0, gamma, epsilon);
    this.firstVisit = firstVisit;
    this.returnsSum = Array(env.nStates).fill(0).map(() => Array(env.nActions).fill(0));
    this.returnsCount = Array(env.nStates).fill(0).map(() => Array(env.nActions).fill(0));
  }

  trainEpisode() {
    const episode = [];
    let state = this.env.reset();
    let done = false;
    let totalReward = 0;
    let steps = 0;
    
    while (!done && steps < 1000) {
      const action = this.chooseAction(state);
      const stepResult = this.env.step(action);
      if (!stepResult) break;
      
      const { state: nextState, reward, done: isDone } = stepResult;
      episode.push({ state, action, reward });
      state = nextState;
      done = isDone;
      totalReward += reward;
      steps++;
    }
    
    let G = 0;
    const visited = new Set();
    
    for (let t = episode.length - 1; t >= 0; t--) {
      const { state, action, reward } = episode[t];
      G = this.gamma * G + reward;
      
      const stateActionKey = `${state},${action}`;
      if (this.firstVisit && visited.has(stateActionKey)) {
        continue;
      }
      visited.add(stateActionKey);
      
      if (this.returnsCount[state] && this.returnsCount[state][action] !== undefined) {
        this.returnsSum[state][action] += G;
        this.returnsCount[state][action] += 1;
        this.qTable[state][action] = this.returnsSum[state][action] / this.returnsCount[state][action];
      }
    }
    
    this.episodeReturns.push(totalReward);
    this.stepCount += episode.length;
    return totalReward;
  }

  train(episodes = 100) {
    for (let ep = 0; ep < episodes; ep++) {
      this.trainEpisode();
    }
  }
}