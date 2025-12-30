import React from 'react';

export class PolicyEvaluation {
  constructor(env, policy, gamma = 0.9) {
    this.env = env;
    this.policy = policy;
    this.gamma = gamma;
    this.values = new Array(env.nStates).fill(0);
    this.deltaHistory = [];
  }

  evaluate(iterations = 100, theta = 0.0001) {
    for (let iter = 0; iter < iterations; iter++) {
      let delta = 0;
      const newValues = [...this.values];
      
      for (let s = 0; s < this.env.nStates; s++) {
        if (!this.env.hasTransitionModel) continue;
        
        const action = this.policy[s];
        let expectedValue = 0;
        
        const transitions = this.env.getTransitions(s, action);
        for (const t of transitions) {
          expectedValue += t.prob * (
            t.reward + (t.done ? 0 : this.gamma * this.values[t.nextState])
          );
        }
        
        newValues[s] = expectedValue;
        delta = Math.max(delta, Math.abs(newValues[s] - this.values[s]));
      }
      
      this.values = newValues;
      this.deltaHistory.push(delta);
      
      if (delta < theta) break;
    }
  }

  getValues() {
    return this.values;
  }

  getMetrics() {
    return {
      deltaHistory: this.deltaHistory
    };
  }
}

export class PolicyIteration {
  constructor(env, gamma = 0.9) {
    this.env = env;
    this.gamma = gamma;
    this.values = new Array(env.nStates).fill(0);
    this.policy = new Array(env.nStates).fill(0);
    this.deltaHistory = [];
    this.policyStableHistory = [];
  }

  evaluatePolicy(iterations = 100, theta = 0.0001) {
    for (let iter = 0; iter < iterations; iter++) {
      let delta = 0;
      const newValues = [...this.values];
      
      for (let s = 0; s < this.env.nStates; s++) {
        const action = this.policy[s];
        let expectedValue = 0;
        
        if (this.env.getTransitions) {
          const transitions = this.env.getTransitions(s, action);
          for (const t of transitions) {
            expectedValue += t.prob * (
              t.reward + (t.done ? 0 : this.gamma * this.values[t.nextState])
            );
          }
        }
        
        newValues[s] = expectedValue;
        delta = Math.max(delta, Math.abs(newValues[s] - this.values[s]));
      }
      
      this.values = newValues;
      this.deltaHistory.push(delta);
      if (delta < theta) break;
    }
  }

  improvePolicy() {
    let policyStable = true;
    
    for (let s = 0; s < this.env.nStates; s++) {
      const oldAction = this.policy[s];
      let bestAction = 0;
      let bestValue = -Infinity;
      
      for (let a = 0; a < this.env.nActions; a++) {
        let expectedValue = 0;
        
        if (this.env.getTransitions) {
          const transitions = this.env.getTransitions(s, a);
          for (const t of transitions) {
            expectedValue += t.prob * (
              t.reward + (t.done ? 0 : this.gamma * this.values[t.nextState])
            );
          }
        }
        
        if (expectedValue > bestValue) {
          bestValue = expectedValue;
          bestAction = a;
        }
      }
      
      this.policy[s] = bestAction;
      if (oldAction !== bestAction) policyStable = false;
    }
    
    this.policyStableHistory.push(policyStable);
    return policyStable;
  }

  train(maxIterations = 10) {
    for (let i = 0; i < maxIterations; i++) {
      this.evaluatePolicy(10);
      if (this.improvePolicy()) break;
    }
  }

  getPolicy() {
    return this.policy;
  }

  getValues() {
    return this.values;
  }

  getMetrics() {
    return {
      deltaHistory: this.deltaHistory,
      policyStableHistory: this.policyStableHistory
    };
  }
}

export class ValueIteration {
  constructor(env, gamma = 0.9) {
    this.env = env;
    this.gamma = gamma;
    this.values = new Array(env.nStates).fill(0);
    this.policy = new Array(env.nStates).fill(0);
    this.deltaHistory = [];
  }

  train(iterations = 100, theta = 0.0001) {
    for (let iter = 0; iter < iterations; iter++) {
      let delta = 0;
      const newValues = [...this.values];
      
      for (let s = 0; s < this.env.nStates; s++) {
        let maxValue = -Infinity;
        let bestAction = 0;
        
        for (let a = 0; a < this.env.nActions; a++) {
          let expectedValue = 0;
          
          if (this.env.getTransitions) {
            const transitions = this.env.getTransitions(s, a);
            for (const t of transitions) {
              expectedValue += t.prob * (
                t.reward + (t.done ? 0 : this.gamma * this.values[t.nextState])
              );
            }
          }
          
          if (expectedValue > maxValue) {
            maxValue = expectedValue;
            bestAction = a;
          }
        }
        
        newValues[s] = maxValue;
        this.policy[s] = bestAction;
        delta = Math.max(delta, Math.abs(newValues[s] - this.values[s]));
      }
      
      this.values = newValues;
      this.deltaHistory.push(delta);
      
      if (delta < theta) break;
    }
  }

  getPolicy() {
    return this.policy;
  }

  getValues() {
    return this.values;
  }

  getMetrics() {
    return {
      deltaHistory: this.deltaHistory
    };
  }
}