import React from 'react';

export class CartPole {
  constructor(rewardConfig = {}) {
    this.nStates = 100;
    this.nActions = 2;
    this.hasTransitionModel = false;
    this.rewardConfig = {
      stepReward: 1,
      failPenalty: 0,
      maxSteps: 200,
      ...rewardConfig
    };
    this.reset();
  }

  reset() {
    this.position = 0;
    this.velocity = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.steps = 0;
    return this.getState();
  }

  getState() {
    let safePosition = isFinite(this.position) ? this.position : 0;
    let safeAngle = isFinite(this.angle) ? this.angle : 0;
    
    safePosition = Math.max(-2.4, Math.min(2.4, safePosition));
    safeAngle = Math.max(-0.42, Math.min(0.42, safeAngle));
    
    const posIdx = Math.min(9, Math.max(0, Math.floor((safePosition + 2.4) / 4.8 * 10)));
    const angleIdx = Math.min(9, Math.max(0, Math.floor((safeAngle + 0.42) / 0.84 * 10)));
    return posIdx * 10 + angleIdx;
  }

  step(action) {
    const force = action === 1 ? 1 : -1;
    const gravity = 9.8;
    const massCart = 1.0;
    const massPole = 0.1;
    const length = 0.5;
    const dt = 0.02;

    const cosTheta = Math.cos(this.angle);
    const sinTheta = Math.sin(this.angle);
    const temp = (force + massPole * length * this.angularVelocity ** 2 * sinTheta) / (massCart + massPole);
    const angularAccel = (gravity * sinTheta - cosTheta * temp) / (length * (4/3 - massPole * cosTheta ** 2 / (massCart + massPole)));
    const accel = temp - massPole * length * angularAccel * cosTheta / (massCart + massPole);

    this.position += this.velocity * dt;
    this.velocity += accel * dt;
    this.angle += this.angularVelocity * dt;
    this.angularVelocity += angularAccel * dt;
    this.steps++;

    this.position = Math.max(-2.4, Math.min(2.4, this.position));
    this.angle = Math.max(-0.42, Math.min(0.42, this.angle));
    this.velocity = Math.max(-10, Math.min(10, this.velocity));
    this.angularVelocity = Math.max(-10, Math.min(10, this.angularVelocity));

    const done = Math.abs(this.position) > 2.4 || Math.abs(this.angle) > 0.42 || this.steps >= this.rewardConfig.maxSteps;
    const reward = done ? this.rewardConfig.failPenalty : this.rewardConfig.stepReward;

    return { state: this.getState(), reward, done };
  }
}

export default CartPole;