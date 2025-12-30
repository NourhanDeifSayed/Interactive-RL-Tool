import React from 'react';

export class TemporalDifference {
  constructor(env, alpha = 0.1, gamma = 0.9, behaviorPolicy = 'random') {
    this.env = env;
    this.alpha = alpha;
    this.gamma = gamma;
    this.behaviorPolicy = behaviorPolicy;
    this.values = new Array(env.nStates).fill(0);
    this.episodeReturns = [];
    this.stepCount = 0;
  }

  chooseAction(state) {
    if (this.behaviorPolicy === 'random') {
      return Math.floor(Math.random() * this.env.nActions);
    }
    return Math.floor(Math.random() * this.env.nActions);
  }

  trainEpisode() {
    let state = this.env.reset();
    let done = false;
    let totalReward = 0;
    let steps = 0;
    
    while (!done && steps < 1000) {
      const action = this.chooseAction(state);
      const stepResult = this.env.step(action);
      if (!stepResult) break;
      
      const { state: nextState, reward, done: isDone } = stepResult;
      
      if (state !== undefined && nextState !== undefined && 
          this.values[state] !== undefined && this.values[nextState] !== undefined) {
        this.values[state] += this.alpha * (
          reward + this.gamma * this.values[nextState] - this.values[state]
        );
      }
      
      state = nextState;
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

  getPolicy() {
    return null;
  }

  getValues() {
    return this.values;
  }

  getMetrics() {
    return {
      episodeReturns: this.episodeReturns,
      stepCount: this.stepCount,
      latestReturn: this.episodeReturns.length > 0 ? this.episodeReturns[this.episodeReturns.length - 1] : 0
    };
  }
}

export class NStepTD {
  constructor(env, n = 3, alpha = 0.1, gamma = 0.9, epsilon = 0.1) {
    this.env = env;
    this.n = n;
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
    
    const safeQValues = qValues.map(q => isFinite(q) ? q : -Infinity);
    const maxQ = Math.max(...safeQValues);
    
    if (!isFinite(maxQ)) {
      return Math.floor(Math.random() * this.env.nActions);
    }
    
    const bestActions = safeQValues.map((q, idx) => Math.abs(q - maxQ) < 0.0001 ? idx : -1).filter(idx => idx !== -1);
    return bestActions[Math.floor(Math.random() * bestActions.length)];
  }

  trainEpisode() {
    const states = [];
    const actions = [];
    const rewards = [0];
    
    let state = this.env.reset();
    let done = false;
    let totalReward = 0;
    let time = 0;
    
    states.push(state);
    
    while (true) {
      if (time < 1000) {
        const action = this.chooseAction(state);
        actions.push(action);
        
        const stepResult = this.env.step(action);
        if (!stepResult) break;
        
        const { state: nextState, reward, done: isDone } = stepResult;
        rewards.push(reward);
        states.push(nextState);
        
        state = nextState;
        totalReward += reward;
        this.stepCount++;
        
        if (isDone) {
          const T = time + 1;
          
          for (let tau = Math.max(0, time - this.n + 1); tau < T; tau++) {
            let G = 0;
            const maxTauN = Math.min(tau + this.n, T);
            
            for (let i = tau + 1; i <= maxTauN; i++) {
              G += Math.pow(this.gamma, i - tau - 1) * rewards[i];
            }
            
            if (tau + this.n < T) {
              const nextState = states[tau + this.n];
              const nextAction = actions[tau + this.n];
              if (nextAction !== undefined && this.qTable[nextState] && this.qTable[nextState][nextAction] !== undefined) {
                G += Math.pow(this.gamma, this.n) * this.qTable[nextState][nextAction];
              }
            }
            
            const currentState = states[tau];
            const currentAction = actions[tau];
            if (currentState !== undefined && currentAction !== undefined && 
                this.qTable[currentState] && this.qTable[currentState][currentAction] !== undefined) {
              const delta = G - this.qTable[currentState][currentAction];
              if (isFinite(delta)) {
                this.qTable[currentState][currentAction] += this.alpha * delta;
              }
            }
          }
          
          break;
        }
        
        const tau = time - this.n + 1;
        if (tau >= 0) {
          let G = 0;
          for (let i = tau + 1; i <= tau + this.n; i++) {
            G += Math.pow(this.gamma, i - tau - 1) * rewards[i];
          }
          
          const nextState = states[tau + this.n];
          const nextAction = actions[tau + this.n];
          if (nextAction !== undefined && this.qTable[nextState] && this.qTable[nextState][nextAction] !== undefined) {
            G += Math.pow(this.gamma, this.n) * this.qTable[nextState][nextAction];
          }
          
          const currentState = states[tau];
          const currentAction = actions[tau];
          if (currentState !== undefined && currentAction !== undefined && 
              this.qTable[currentState] && this.qTable[currentState][currentAction] !== undefined) {
            const delta = G - this.qTable[currentState][currentAction];
            if (isFinite(delta)) {
              this.qTable[currentState][currentAction] += this.alpha * delta;
            }
          }
        }
        
        time++;
      } else {
        break;
      }
    }
    
    this.episodeReturns.push(totalReward);
    return totalReward;
  }

  train(episodes = 100) {
    for (let ep = 0; ep < episodes; ep++) {
      this.trainEpisode();
    }
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