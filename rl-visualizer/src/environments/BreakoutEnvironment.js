export class BreakoutEnvironment {
  constructor(rewardConfig = {}) {
    this.width = 10;
    this.height = 20;
    this.nStates = this.width * this.height;
    this.nActions = 3;
    this.hasTransitionModel = false;
    this.rewardConfig = {
      brickReward: 1,
      missPenalty: -1,
      stepPenalty: -0.1,
      winReward: 10,
      ...rewardConfig
    };
    this.reset();
  }

  reset() {
    this.paddlePos = Math.floor(this.width / 2);
    this.ballPos = { x: this.width / 2, y: this.height - 3 };
    this.ballVel = { x: Math.random() > 0.5 ? 0.5 : -0.5, y: -0.5 };
    this.bricks = [];
    
    for (let row = 2; row < 6; row++) {
      for (let col = 1; col < this.width - 1; col++) {
        this.bricks.push({ x: col, y: row });
      }
    }
    
    this.steps = 0;
    this.score = 0;
    return this.getState();
  }

  getState() {
    const paddleIdx = Math.floor(this.paddlePos / this.width * 10);
    const ballXIdx = Math.floor(this.ballPos.x / this.width * 10);
    const ballYIdx = Math.floor(this.ballPos.y / this.height * 10);
    return Math.min(999, paddleIdx * 100 + ballXIdx * 10 + ballYIdx);
  }

  step(action) {
    if (action === 0) this.paddlePos = Math.max(1, this.paddlePos - 1);
    else if (action === 2) this.paddlePos = Math.min(this.width - 2, this.paddlePos + 1);
    
    this.ballPos.x += this.ballVel.x;
    this.ballPos.y += this.ballVel.y;
    
    if (this.ballPos.x <= 0 || this.ballPos.x >= this.width - 1) {
      this.ballVel.x *= -1;
      this.ballPos.x = Math.max(0, Math.min(this.width - 1, this.ballPos.x));
    }
    
    if (this.ballPos.y <= 0) {
      this.ballVel.y *= -1;
      this.ballPos.y = 0;
    }
    
    let reward = this.rewardConfig.stepPenalty;
    let done = false;
    
    if (this.ballPos.y >= this.height - 2 && Math.abs(this.ballPos.x - this.paddlePos) <= 1.5) {
      this.ballVel.y = -Math.abs(this.ballVel.y);
      this.ballPos.y = this.height - 3;
      this.ballVel.x += (Math.random() - 0.5) * 0.2;
      this.ballVel.x = Math.max(-1, Math.min(1, this.ballVel.x));
    }
    
    if (this.ballPos.y >= this.height) {
      reward = this.rewardConfig.missPenalty;
      done = true;
    }
    
    const remainingBricks = [];
    let brickHit = false;
    
    for (const brick of this.bricks) {
      const dx = Math.abs(this.ballPos.x - brick.x);
      const dy = Math.abs(this.ballPos.y - brick.y);
      
      if (dx < 0.8 && dy < 0.8) {
        reward = this.rewardConfig.brickReward;
        this.score += 1;
        brickHit = true;
        
        if (dx > dy) {
          this.ballVel.x *= -1;
        } else {
          this.ballVel.y *= -1;
        }
      } else {
        remainingBricks.push(brick);
      }
    }
    
    this.bricks = remainingBricks;
    
    if (this.bricks.length === 0) {
      reward = this.rewardConfig.winReward;
      done = true;
    }
    
    const speed = Math.sqrt(this.ballVel.x ** 2 + this.ballVel.y ** 2);
    if (speed > 0) {
      this.ballVel.x = (this.ballVel.x / speed) * 0.5;
      this.ballVel.y = (this.ballVel.y / speed) * 0.5;
    }
    
    this.steps++;
    
    return { state: this.getState(), reward, done };
  }

  getStateCoords(state) {
    const paddle = Math.floor(state / 100);
    const ballX = Math.floor((state % 100) / 10);
    const ballY = state % 10;
    return { paddle, ballX, ballY };
  }
}