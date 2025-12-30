import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Zap, Brain, BarChart3, Grid, Mountain, Snowflake, TrendingUp, Shield, AlertCircle, Target, GitCompare, Book, RefreshCw, StopCircle, Download, Upload, Sliders, X, Home, Award, Battery, Gamepad2, Globe } from 'lucide-react';

// Import environments
import { GridWorld, FrozenLake, CartPole, MountainCar, BreakoutEnvironment } from './environments';

// Import algorithms
import { PolicyEvaluation, PolicyIteration, ValueIteration, BaseAgent, QLearning, SARSA, MonteCarlo, TemporalDifference, NStepTD } from './algorithms';

// Import styles
import { styles } from './styles/constants';

// Import components
import { Card, SectionHeader, ParameterSlider, ActionButton, StatusBadge, ValueGrid } from './components/common';
import { CanvasRenderer, MetricsChart } from './components/visualization';
import { EnvironmentCard, AlgorithmCard, AlgorithmInfo, RewardSettingsPanel } from './components/panels';

// ============ MAIN COMPONENT ============

export default function RLVisualizer() {
  const [selectedEnv, setSelectedEnv] = useState('gridworld');
  const [selectedAlgo, setSelectedAlgo] = useState('qlearning');
  const [params, setParams] = useState({
    gamma: 0.9,
    alpha: 0.1,
    epsilon: 0.1,
    episodes: 100,
    nStep: 3,
    iterations: 100,
    theta: 0.0001
  });
  
  const [env, setEnv] = useState(null);
  const [agent, setAgent] = useState(null);
  const [agentSnapshot, setAgentSnapshot] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentState, setCurrentState] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [showRewardSettings, setShowRewardSettings] = useState(false);
  const [rewardConfig, setRewardConfig] = useState({});
  const [trainingMetrics, setTrainingMetrics] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const trainingIntervalRef = useRef(null);
  const inferenceIntervalRef = useRef(null);
  const resizeObserverRef = useRef(null);
  
  const environments = [
    { id: 'gridworld', name: 'GridWorld', description: '5x5 grid with obstacles', icon: Grid },
    { id: 'frozenlake', name: 'Frozen Lake', description: '4x4 slippery ice grid', icon: Snowflake },
    { id: 'cartpole', name: 'CartPole', description: 'Balance a pole on a cart', icon: TrendingUp },
    { id: 'mountaincar', name: 'Mountain Car', description: 'Drive up a steep hill', icon: Mountain },
    { id: 'breakout', name: 'Breakout', description: 'Simple breakout game', icon: Gamepad2 },
  ];
  
  const algorithms = [
    { id: 'policyevaluation', name: 'Policy Evaluation', description: 'Evaluate a fixed policy', category: 'DP', requiresTransitionModel: true },
    { id: 'policyiteration', name: 'Policy Iteration', description: 'Alternates policy evaluation and improvement', category: 'DP', requiresTransitionModel: true },
    { id: 'valueiteration', name: 'Value Iteration', description: 'Iteratively computes optimal value function', category: 'DP', requiresTransitionModel: true },
    { id: 'montecarlo', name: 'Monte Carlo', description: 'Learns from complete episodes', category: 'MC', requiresTransitionModel: false },
    { id: 'td', name: 'TD(0)', description: 'One-step temporal difference learning', category: 'TD', requiresTransitionModel: false },
    { id: 'nsteptd', name: 'n-step TD', description: 'Multi-step temporal difference', category: 'TD', requiresTransitionModel: false },
    { id: 'sarsa', name: 'SARSA', description: 'On-policy TD control', category: 'TD', requiresTransitionModel: false },
    { id: 'qlearning', name: 'Q-Learning', description: 'Off-Policy TD control', category: 'TD', requiresTransitionModel: false }
  ];
  
  const initializeEnvironment = useCallback(() => {
    let newEnv;
    switch (selectedEnv) {
      case 'gridworld':
        newEnv = new GridWorld(5, rewardConfig);
        break;
      case 'cartpole':
        newEnv = new CartPole(rewardConfig);
        break;
      case 'mountaincar':
        newEnv = new MountainCar(rewardConfig);
        break;
      case 'frozenlake':
        newEnv = new FrozenLake(4, rewardConfig);
        break;
      case 'breakout':
        newEnv = new BreakoutEnvironment(rewardConfig);
        break;
      default:
        newEnv = new GridWorld(5, rewardConfig);
    }
    setEnv(newEnv);
    setCurrentState(newEnv.reset());
    setIsTrained(false);
    setIsPlaying(false);
    setIsPaused(false);
    setTrainingMetrics(null);
    setSelectedCell(null);
  }, [selectedEnv, rewardConfig]);
  
  const initializeAgent = useCallback(() => {
    if (!env) return;
    
    stopAllProcesses();
    
    let newAgent;
    switch (selectedAlgo) {
      case 'policyevaluation':
        if (!env.hasTransitionModel) {
          alert('Policy Evaluation requires a transition model.');
          setSelectedAlgo('qlearning');
          return;
        }
        const randomPolicy = new Array(env.nStates).fill(0).map(() => 
          Math.floor(Math.random() * env.nActions)
        );
        newAgent = new PolicyEvaluation(env, randomPolicy, params.gamma);
        break;
      case 'policyiteration':
        if (!env.hasTransitionModel) {
          alert('Policy Iteration requires a transition model.');
          setSelectedAlgo('qlearning');
          return;
        }
        newAgent = new PolicyIteration(env, params.gamma);
        break;
      case 'valueiteration':
        if (!env.hasTransitionModel) {
          alert('Value Iteration requires a transition model.');
          setSelectedAlgo('qlearning');
          return;
        }
        newAgent = new ValueIteration(env, params.gamma);
        break;
      case 'montecarlo':
        newAgent = new MonteCarlo(env, params.gamma, params.epsilon);
        break;
      case 'td':
        newAgent = new TemporalDifference(env, params.alpha, params.gamma);
        break;
      case 'nsteptd':
        newAgent = new NStepTD(env, params.nStep, params.alpha, params.gamma, params.epsilon);
        break;
      case 'sarsa':
        newAgent = new SARSA(env, params.alpha, params.gamma, params.epsilon);
        break;
      case 'qlearning':
        newAgent = new QLearning(env, params.alpha, params.gamma, params.epsilon);
        break;
      default:
        newAgent = new QLearning(env, params.alpha, params.gamma, params.epsilon);
    }
    setAgent(newAgent);
    setAgentSnapshot(createAgentSnapshot(newAgent));
    setIsTrained(false);
    setTrainingMetrics(null);
  }, [env, selectedAlgo, params]);
  
  const createAgentSnapshot = (agent) => {
    if (!agent) return null;
    
    if (agent instanceof QLearning || agent instanceof SARSA || agent instanceof MonteCarlo || agent instanceof NStepTD) {
      const safeQTable = agent.qTable.map(row => 
        row.map(val => isFinite(val) ? val : 0)
      );
      return {
        qTable: safeQTable,
        episodeReturns: [...(agent.episodeReturns || [])],
        stepCount: agent.stepCount || 0
      };
    } else if (agent instanceof TemporalDifference) {
      const safeValues = agent.values.map(val => isFinite(val) ? val : 0);
      return {
        values: safeValues,
        episodeReturns: [...(agent.episodeReturns || [])],
        stepCount: agent.stepCount || 0
      };
    } else if (agent instanceof PolicyIteration || agent instanceof ValueIteration || agent instanceof PolicyEvaluation) {
      const safeValues = agent.values.map(val => isFinite(val) ? val : 0);
      return {
        values: safeValues,
        policy: agent.policy ? [...agent.policy] : null,
        deltaHistory: agent.deltaHistory ? [...agent.deltaHistory] : []
      };
    }
    return null;
  };
  
  const stopAllProcesses = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
      trainingIntervalRef.current = null;
    }
    if (inferenceIntervalRef.current) {
      clearInterval(inferenceIntervalRef.current);
      inferenceIntervalRef.current = null;
    }
  };
  
  const startTraining = () => {
    if (!agent || !env) return;
    
    stopAllProcesses();
    setIsTraining(true);
    setIsPlaying(false);
    setIsPaused(false);
    setTrainingProgress(0);
    setEpisodeCount(0);
    setTrainingMetrics(null);
    
    const totalEpisodes = params.episodes;
    const batchSize = Math.max(1, Math.min(10, Math.floor(totalEpisodes / 20)));
    let episodesDone = 0;
    
    const trainBatch = () => {
      if (episodesDone >= totalEpisodes || isPaused) {
        if (episodesDone >= totalEpisodes) {
          setIsTraining(false);
          setIsTrained(true);
          setTrainingProgress(100);
        }
        return;
      }
      
      const episodesToTrain = Math.min(batchSize, totalEpisodes - episodesDone);
      
      for (let i = 0; i < episodesToTrain; i++) {
        try {
          if (agent.trainEpisode) {
            agent.trainEpisode();
          } else if (agent.train) {
            agent.train(1);
          } else if (agent instanceof PolicyIteration || agent instanceof ValueIteration) {
            if (agent instanceof PolicyIteration) {
              agent.evaluatePolicy(1);
              agent.improvePolicy();
            } else if (agent instanceof ValueIteration) {
              agent.train(1);
            }
          }
          episodesDone++;
          setEpisodeCount(episodesDone);
        } catch (error) {
          console.error('Training error:', error);
          episodesDone++;
          setEpisodeCount(episodesDone);
        }
      }
      
      setTrainingProgress((episodesDone / totalEpisodes) * 100);
      setAgentSnapshot(createAgentSnapshot(agent));
      
      if (agent.getMetrics) {
        setTrainingMetrics(agent.getMetrics());
      }
      
      if (episodesDone < totalEpisodes && !isPaused) {
        trainingIntervalRef.current = setTimeout(trainBatch, 50);
      } else if (episodesDone >= totalEpisodes) {
        setIsTraining(false);
        setIsTrained(true);
        setTrainingProgress(100);
      }
    };
    
    trainBatch();
  };
  
  const pauseTraining = () => {
    setIsPaused(true);
    if (trainingIntervalRef.current) {
      clearTimeout(trainingIntervalRef.current);
      trainingIntervalRef.current = null;
    }
  };
  
  const resumeTraining = () => {
    if (!isTraining || !isPaused) return;
    setIsPaused(false);
    startTraining();
  };
  
  const startInference = () => {
    if (!isTrained || !env || !agent) return;
    
    stopAllProcesses();
    setIsPlaying(true);
    setIsPaused(false);
    let state = env.reset();
    setCurrentState(state);
    
    const step = () => {
      if (isPaused) return;
      
      const isTerminal = 
        (env.goalState !== undefined && state === env.goalState) || 
        (env.holes && env.holes.includes(state)) ||
        (env.obstacles && env.obstacles.includes(state));
      
      if (isTerminal) {
        setIsPlaying(false);
        return;
      }
      
      let action;
      
      if (agent.getPolicy) {
        const policy = agent.getPolicy();
        if (policy && policy[state] !== undefined) {
          action = policy[state];
        } else {
          action = 0;
        }
      } else if (agent.policy) {
        action = agent.policy[state];
      } else {
        action = 0;
      }
      
      const { state: nextState, done } = env.step(action);
      setCurrentState(nextState);
      state = nextState;
      
      if (!done && !isPaused) {
        inferenceIntervalRef.current = setTimeout(step, selectedEnv === 'breakout' ? 50 : 200);
      } else {
        setIsPlaying(false);
      }
    };
    
    inferenceIntervalRef.current = setTimeout(step, selectedEnv === 'breakout' ? 50 : 200);
  };
  
  const pauseInference = () => {
    setIsPaused(true);
    if (inferenceIntervalRef.current) {
      clearTimeout(inferenceIntervalRef.current);
      inferenceIntervalRef.current = null;
    }
  };
  
  const resumeInference = () => {
    if (!isPlaying || !isPaused) return;
    setIsPaused(false);
    startInference();
  };
  
  const resetEnvironment = () => {
    stopAllProcesses();
    if (env) {
      setCurrentState(env.reset());
    }
    setIsPlaying(false);
    setIsTraining(false);
    setIsPaused(false);
  };
  
  const drawGridEnvironment = useCallback((ctx, width, height) => {
    if (!env) return;
    
    const size = env.size || 5;
    const cellSize = Math.min(width, height) / (size + 2);
    const offsetX = (width - size * cellSize) / 2;
    const offsetY = (height - size * cellSize) / 2;
    
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const state = i * size + j;
        const x = offsetX + j * cellSize;
        const y = offsetY + i * cellSize;
        
        if (isTrained && agentSnapshot) {
          let value;
          if (agentSnapshot.values) {
            value = agentSnapshot.values[state];
          } else if (agentSnapshot.qTable && agentSnapshot.qTable[state]) {
            const qValues = agentSnapshot.qTable[state];
            value = qValues.length > 0 ? Math.max(...qValues) : 0;
          }
          
          if (value !== undefined) {
            const maxValue = Math.max(...(agentSnapshot.values || agentSnapshot.qTable?.map(q => Math.max(...q)) || [0]));
            const minValue = Math.min(...(agentSnapshot.values || agentSnapshot.qTable?.map(q => Math.min(...q)) || [0]));
            const normalized = maxValue !== minValue ? (value - minValue) / (maxValue - minValue) : 0;
            
            const cellGradient = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
            cellGradient.addColorStop(0, `rgba(25, 118, 210, ${normalized * 0.4})`);
            cellGradient.addColorStop(1, `rgba(25, 118, 210, ${normalized * 0.8})`);
            ctx.fillStyle = cellGradient;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
        
        if (selectedCell === state) {
          ctx.strokeStyle = '#ffb300';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
        
        if (state === env.goalState) {
          ctx.fillStyle = '#2e7d32';
          ctx.fillRect(x, y, cellSize, cellSize);
          
          ctx.fillStyle = 'white';
          ctx.font = `bold ${Math.max(14, cellSize/3)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🏆', x + cellSize / 2, y + cellSize / 2);
        }
        
        if ((env.obstacles && env.obstacles.includes(state)) || 
            (env.holes && env.holes.includes(state))) {
          ctx.fillStyle = '#d32f2f';
          ctx.fillRect(x, y, cellSize, cellSize);
          
          ctx.fillStyle = 'white';
          ctx.font = `bold ${Math.max(14, cellSize/3)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚠️', x + cellSize / 2, y + cellSize / 2);
        }
        
        if (isTrained && agentSnapshot) {
          let action;
          if (agentSnapshot.policy && agentSnapshot.policy[state] !== undefined) {
            action = agentSnapshot.policy[state];
          } else if (agentSnapshot.qTable && agentSnapshot.qTable[state]) {
            const qValues = agentSnapshot.qTable[state];
            if (qValues.length > 0) {
              const maxQ = Math.max(...qValues);
              action = qValues.indexOf(maxQ);
            }
          }
          
          if (action !== undefined && action !== null &&
              state !== env.goalState && 
              !(env.obstacles && env.obstacles.includes(state)) && 
              !(env.holes && env.holes.includes(state))) {
            
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = Math.max(2, cellSize/15);
            ctx.lineCap = 'round';
            ctx.beginPath();
            
            const cx = x + cellSize / 2;
            const cy = y + cellSize / 2;
            const arrowLen = cellSize / 3;
            
            let dx = 0, dy = 0;
            if (action === 0) dy = -arrowLen;
            else if (action === 1) dx = arrowLen;
            else if (action === 2) dy = arrowLen;
            else if (action === 3) dx = -arrowLen;
            
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + dx * 0.8, cy + dy * 0.8);
            ctx.stroke();
            
            ctx.beginPath();
            const angle = Math.atan2(dy, dx);
            const headSize = Math.max(6, cellSize/8);
            ctx.moveTo(cx + dx * 0.8, cy + dy * 0.8);
            ctx.lineTo(
              cx + dx * 0.8 - headSize * Math.cos(angle - Math.PI / 6),
              cy + dy * 0.8 - headSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              cx + dx * 0.8 - headSize * Math.cos(angle + Math.PI / 6),
              cy + dy * 0.8 - headSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = '#1a1a1a';
            ctx.fill();
          }
        }
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = Math.max(1, cellSize/80);
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        if (cellSize > 30) {
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.font = `${Math.max(8, cellSize/8)}px monospace`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(state.toString(), x + 2, y + 2);
        }
      }
    }
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    if (env.getStateCoords) {
      const { row, col } = env.getStateCoords(currentState);
      const centerX = offsetX + col * cellSize + cellSize / 2;
      const centerY = offsetY + row * cellSize + cellSize / 2;
      const radius = cellSize / 3;
      
      ctx.beginPath();
      ctx.arc(centerX + 3, centerY + 3, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      const agentGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      agentGradient.addColorStop(0, '#ffb300');
      agentGradient.addColorStop(1, '#ff8f00');
      ctx.fillStyle = agentGradient;
      ctx.fill();
      
      ctx.strokeStyle = '#ff6f00';
      ctx.lineWidth = Math.max(2, cellSize/20);
      ctx.stroke();
      
      if (isPlaying && agentSnapshot) {
        let action;
        if (agentSnapshot.policy && agentSnapshot.policy[currentState] !== undefined) {
          action = agentSnapshot.policy[currentState];
        } else if (agentSnapshot.qTable && agentSnapshot.qTable[currentState]) {
          const qValues = agentSnapshot.qTable[currentState];
          if (qValues.length > 0) {
            const maxQ = Math.max(...qValues);
            action = qValues.indexOf(maxQ);
          }
        }
        
        if (action !== undefined && action !== null) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = Math.max(2, cellSize/30);
          ctx.lineCap = 'round';
          ctx.beginPath();
          
          let dx = 0, dy = 0;
          const indicatorLen = radius * 0.6;
          
          if (action === 0) dy = -indicatorLen;
          else if (action === 1) dx = indicatorLen;
          else if (action === 2) dy = indicatorLen;
          else if (action === 3) dx = -indicatorLen;
          
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + dx, centerY + dy);
          ctx.stroke();
        }
      }
    }
  }, [env, agentSnapshot, currentState, isTrained, selectedCell, isPlaying]);
  
  const drawBreakout = useCallback((ctx, width, height) => {
    if (!env || width <= 0 || height <= 0) return;
    
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#000814');
    bgGradient.addColorStop(1, '#001d3d');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    const brickWidth = width / (env.width || 10);
    const brickHeight = height / 30;
    
    for (const brick of env.bricks || []) {
      const brickX = brick.x * brickWidth;
      const brickY = brick.y * brickHeight;
      
      const brickGradient = ctx.createLinearGradient(brickX, brickY, brickX + brickWidth, brickY + brickHeight);
      brickGradient.addColorStop(0, '#1976d2');
      brickGradient.addColorStop(1, '#0d47a1');
      ctx.fillStyle = brickGradient;
      ctx.fillRect(brickX, brickY, brickWidth - 2, brickHeight - 2);
      
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(brickX, brickY, brickWidth - 2, 2);
      ctx.fillRect(brickX, brickY, 2, brickHeight - 2);
      
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(brickX + brickWidth - 2, brickY, 2, brickHeight - 2);
      ctx.fillRect(brickX, brickY + brickHeight - 2, brickWidth - 2, 2);
    }
    
    const paddleWidth = width / 4;
    const paddleHeight = height / 40;
    const paddleX = (env.paddlePos || 0) * (width / (env.width || 10)) - paddleWidth / 2;
    const paddleY = height - paddleHeight - 20;
    
    const paddleGradient = ctx.createLinearGradient(paddleX, paddleY, paddleX + paddleWidth, paddleY + paddleHeight);
    paddleGradient.addColorStop(0, '#2e7d32');
    paddleGradient.addColorStop(1, '#1b5e20');
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
    
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(paddleX, paddleY, paddleWidth, 3);
    ctx.fillRect(paddleX, paddleY, 3, paddleHeight);
    
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(paddleX + paddleWidth - 3, paddleY, 3, paddleHeight);
    ctx.fillRect(paddleX, paddleY + paddleHeight - 3, paddleWidth, 3);
    
    const ballRadius = Math.min(width, height) / 40;
    const ballX = (env.ballPos?.x || 0) * (width / (env.width || 10));
    const ballY = (env.ballPos?.y || 0) * (height / (env.height || 20));
    
    const glowGradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, ballRadius * 2);
    glowGradient.addColorStop(0, 'rgba(255, 183, 77, 0.8)');
    glowGradient.addColorStop(1, 'rgba(255, 183, 77, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    const ballGradient = ctx.createRadialGradient(
      ballX - ballRadius/3, ballY - ballRadius/3, 0,
      ballX, ballY, ballRadius
    );
    ballGradient.addColorStop(0, '#ffb300');
    ballGradient.addColorStop(1, '#ff8f00');
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(ballX - ballRadius/3, ballY - ballRadius/3, ballRadius/3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    
    ctx.fillText(`Bricks: ${env.bricks?.length || 0}`, 10, 25);
    ctx.fillText(`Score: ${env.score || 0}`, 10, 45);
    ctx.fillText(`Steps: ${env.steps || 0}`, 10, 65);
    
    if (env.ballVel) {
      const velX = env.ballVel.x * 20;
      const velY = env.ballVel.y * 20;
      
      ctx.strokeStyle = '#ff5252';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + velX, ballY + velY);
      ctx.stroke();
      
      ctx.fillStyle = '#ff5252';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`v: (${velX.toFixed(1)}, ${velY.toFixed(1)})`, ballX, ballY - ballRadius - 10);
    }
    
    if (isPlaying) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PLAYING', width / 2, 40);
    }
  }, [env, isPlaying]);
  
  const drawCartPole = useCallback((ctx, width, height) => {
    if (!env || width <= 0 || height <= 0) return;
    
    const scale = Math.min(width, height) / 600;
    const trackHeight = height * 0.7;
    
    ctx.fillStyle = '#424242';
    ctx.fillRect(0, trackHeight, width, height * 0.05);
    
    ctx.strokeStyle = '#616161';
    ctx.lineWidth = 2 * scale;
    for (let i = 0; i < width; i += 20 * scale) {
      ctx.beginPath();
      ctx.moveTo(i, trackHeight);
      ctx.lineTo(i, trackHeight + 10 * scale);
      ctx.stroke();
    }
    
    const safePosition = isFinite(env.position) ? env.position : 0;
    const safeAngle = isFinite(env.angle) ? env.angle : 0;
    
    const cartX = ((safePosition + 2.4) / 4.8) * width * 0.8 + width * 0.1;
    const cartY = trackHeight;
    const cartWidth = 40 * scale;
    const cartHeight = 20 * scale;
    
    const cartGradient = ctx.createLinearGradient(
      Math.max(0, cartX - cartWidth/2), 
      Math.max(0, cartY - cartHeight/2), 
      Math.min(width, cartX + cartWidth/2), 
      Math.min(height, cartY + cartHeight/2)
    );
    cartGradient.addColorStop(0, '#1976d2');
    cartGradient.addColorStop(1, '#0d47a1');
    ctx.fillStyle = cartGradient;
    ctx.fillRect(cartX - cartWidth/2, cartY - cartHeight/2, cartWidth, cartHeight);
    
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(cartX - cartWidth/3, cartY + cartHeight/2, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cartX + cartWidth/3, cartY + cartHeight/2, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    const poleLength = 100 * scale;
    const poleEndX = cartX + Math.sin(safeAngle) * poleLength;
    const poleEndY = cartY - Math.cos(safeAngle) * poleLength;
    
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 6 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cartX, cartY);
    ctx.lineTo(poleEndX, poleEndY);
    ctx.stroke();
    
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(poleEndX, poleEndY, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10 * scale, 10 * scale, 180 * scale, 80 * scale);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `${12 * scale}px monospace`;
    ctx.textAlign = 'left';
    
    ctx.fillText(`Angle: ${safeAngle?.toFixed(3) || 0} rad`, 20 * scale, 30 * scale);
    ctx.fillText(`Angular Velocity: ${(isFinite(env.angularVelocity) ? env.angularVelocity : 0)?.toFixed(3) || 0}`, 20 * scale, 50 * scale);
    ctx.fillText(`Position: ${safePosition?.toFixed(3) || 0} m`, 20 * scale, 70 * scale);
    ctx.fillText(`Steps: ${env.steps || 0}`, 20 * scale, 90 * scale);
    
    ctx.strokeStyle = 'rgba(211, 47, 47, 0.5)';
    ctx.lineWidth = 2 * scale;
    ctx.setLineDash([5 * scale, 5 * scale]);
    ctx.beginPath();
    ctx.moveTo(width * 0.1, trackHeight - 50 * scale);
    ctx.lineTo(width * 0.1, trackHeight + 50 * scale);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width * 0.9, trackHeight - 50 * scale);
    ctx.lineTo(width * 0.9, trackHeight + 50 * scale);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [env]);
  
  const drawMountainCar = useCallback((ctx, width, height) => {
    if (!env || width <= 0 || height <= 0) return;
    
    const scale = Math.min(width, height) / 500;
    const groundY = height * 0.8;
    
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    
    for (let x = 0; x <= width; x += 5) {
      const pos = (x / width) * 1.8 - 1.2;
      const y = groundY - Math.sin(3 * pos) * 50 * scale - 50 * scale;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, groundY);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 2 * scale;
    for (let x = 50 * scale; x < width; x += 100 * scale) {
      const pos = (x / width) * 1.8 - 1.2;
      const y = groundY - Math.sin(3 * pos) * 50 * scale - 50 * scale;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20 * scale, y - 20 * scale);
      ctx.stroke();
    }
    
    const carX = ((env.position + 1.2) / 1.8) * width;
    const carY = groundY - Math.sin(3 * env.position) * 50 * scale - 50 * scale;
    
    ctx.fillStyle = '#1976d2';
    ctx.beginPath();
    ctx.arc(carX, carY, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#0d47a1';
    ctx.beginPath();
    ctx.arc(carX, carY, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(width * 0.9, groundY - 100 * scale, 5 * scale, 40 * scale);
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.moveTo(width * 0.9 + 5 * scale, groundY - 100 * scale);
    ctx.lineTo(width * 0.9 + 25 * scale, groundY - 90 * scale);
    ctx.lineTo(width * 0.9 + 5 * scale, groundY - 80 * scale);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10 * scale, 10 * scale, 180 * scale, 70 * scale);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `${12 * scale}px monospace`;
    ctx.textAlign = 'left';
    
    ctx.fillText(`Position: ${env.position?.toFixed(3) || 0}`, 20 * scale, 30 * scale);
    ctx.fillText(`Velocity: ${env.velocity?.toFixed(3) || 0}`, 20 * scale, 50 * scale);
    ctx.fillText(`Steps: ${env.steps || 0}`, 20 * scale, 70 * scale);
    
    if (env.velocity) {
      const velX = env.velocity * 100 * scale;
      ctx.strokeStyle = '#f57c00';
      ctx.lineWidth = 3 * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(carX, carY);
      ctx.lineTo(carX + velX, carY);
      ctx.stroke();
    }
  }, [env]);
  
  useEffect(() => {
    initializeEnvironment();
  }, [initializeEnvironment]);
  
  useEffect(() => {
    if (env) {
      initializeAgent();
    }
  }, [env, initializeAgent]);
  
  useEffect(() => {
    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(() => {
          // Canvas will be redrawn in CanvasRenderer component
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      stopAllProcesses();
    };
  }, []);
  
  const handleRewardConfigChange = (newConfig) => {
    setRewardConfig(newConfig);
    setTimeout(() => {
      initializeEnvironment();
      if (agent) {
        initializeAgent();
      }
    }, 0);
  };
  
  const getStatusText = () => {
    if (isPaused) return 'Paused';
    if (isTraining) return 'Training';
    if (isPlaying) return 'Running';
    if (isTrained) return 'Trained';
    return 'Ready';
  };
  
  const getMetricsDisplay = () => {
    if (!trainingMetrics) return null;
    
    const metrics = [];
    
    if (trainingMetrics.episodeReturns && trainingMetrics.episodeReturns.length > 0) {
      const lastReturn = trainingMetrics.episodeReturns[trainingMetrics.episodeReturns.length - 1];
      const avgReturn = trainingMetrics.episodeReturns.reduce((a, b) => a + b, 0) / trainingMetrics.episodeReturns.length;
      
      metrics.push(
        { label: 'Last Return', value: lastReturn.toFixed(2) },
        { label: 'Avg Return', value: avgReturn.toFixed(2) },
        { label: 'Episodes', value: trainingMetrics.episodeReturns.length }
      );
    }
    
    if (trainingMetrics.stepCount) {
      metrics.push({ label: 'Total Steps', value: trainingMetrics.stepCount });
    }
    
    if (trainingMetrics.deltaHistory && trainingMetrics.deltaHistory.length > 0) {
      const lastDelta = trainingMetrics.deltaHistory[trainingMetrics.deltaHistory.length - 1];
      metrics.push({ label: 'ΔV', value: lastDelta.toFixed(6) });
    }
    
    return metrics;
  };
  
  const metricsDisplay = getMetricsDisplay();
  
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.headerContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <Brain size={24} color="#1976d2" />
              </div>
              <div>
                <h1 style={styles.logoText}>RL Learning Lab</h1>
                <p style={styles.subtitle}>Interactive Reinforcement Learning Visualizer</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <StatusBadge 
                status={isPaused ? 'paused' : isTraining ? 'training' : isPlaying ? 'running' : isTrained ? 'trained' : 'idle'} 
                label={getStatusText()} 
              />
              <button 
                onClick={() => setShowRewardSettings(!showRewardSettings)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: showRewardSettings ? '#1976d2' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <Sliders size={20} />
                <span style={{ fontSize: '14px' }}>Rewards</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main style={{...styles.container, padding: '32px 20px'}}>
        <div style={{...styles.grid, gridTemplateColumns: '1fr 2fr', gap: '32px'}}>
          {/* الجانب الأيسر */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card hoverable={true}>
              <SectionHeader 
                title="Environment" 
                description="Choose where your agent will learn"
                icon={GitCompare}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {environments.map((env) => (
                  <EnvironmentCard
                    key={env.id}
                    {...env}
                    selected={selectedEnv === env.id}
                    onClick={() => setSelectedEnv(env.id)}
                  />
                ))}
              </div>
            </Card>
            
            <Card hoverable={true}>
              <SectionHeader 
                title="Learning Algorithm" 
                description="Choose how your agent learns"
                icon={Brain}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {algorithms.map((algo) => (
                  <AlgorithmCard
                    key={algo.id}
                    {...algo}
                    selected={selectedAlgo === algo.id}
                    onClick={() => setSelectedAlgo(algo.id)}
                    disabled={algo.requiresTransitionModel && !env?.hasTransitionModel}
                  />
                ))}
              </div>
            </Card>
            
            <Card hoverable={true}>
              <SectionHeader 
                title="Hyperparameters" 
                description="Tune the learning process"
                icon={BarChart3}
              />
              <div>
                <ParameterSlider
                  label="Discount Factor (γ)"
                  value={params.gamma}
                  min="0"
                  max="1"
                  step="0.05"
                  onChange={(value) => setParams({...params, gamma: value})}
                  description="How much to value future rewards"
                />
                
                {['qlearning', 'sarsa', 'td', 'nsteptd'].includes(selectedAlgo) && (
                  <ParameterSlider
                    label="Learning Rate (α)"
                    value={params.alpha}
                    min="0.01"
                    max="1"
                    step="0.01"
                    onChange={(value) => setParams({...params, alpha: value})}
                    description="How quickly to update values"
                  />
                )}
                
                {['qlearning', 'sarsa', 'montecarlo', 'nsteptd'].includes(selectedAlgo) && (
                  <ParameterSlider
                    label="Exploration Rate (ε)"
                    value={params.epsilon}
                    min="0"
                    max="1"
                    step="0.05"
                    onChange={(value) => setParams({...params, epsilon: value})}
                    description="Probability of random exploration"
                  />
                )}
                
                {selectedAlgo === 'nsteptd' && (
                  <ParameterSlider
                    label="N-Step"
                    value={params.nStep}
                    min="1"
                    max="10"
                    step="1"
                    onChange={(value) => setParams({...params, nStep: value})}
                    description="Number of steps to look ahead"
                  />
                )}
                
                <ParameterSlider
                  label="Training Episodes"
                  value={params.episodes}
                  min="10"
                  max="1000"
                  step="10"
                  onChange={(value) => setParams({...params, episodes: value})}
                  description="Number of training episodes"
                />
                
                {['policyiteration', 'valueiteration', 'policyevaluation'].includes(selectedAlgo) && (
                  <ParameterSlider
                    label="Iterations"
                    value={params.iterations}
                    min="1"
                    max="500"
                    step="1"
                    onChange={(value) => setParams({...params, iterations: value})}
                    description="Number of DP iterations"
                  />
                )}
              </div>
            </Card>
          </div>
          
          {/* الجانب الأيمن */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card hoverable={true}>
              <SectionHeader 
                title="Environment Visualization" 
                description="Watch your agent learn and interact"
                icon={Target}
              />
              <div style={styles.canvasContainer}>
                <CanvasRenderer
                  env={env}
                  agentSnapshot={agentSnapshot}
                  currentState={currentState}
                  isTrained={isTrained}
                  isPlaying={isPlaying}
                  selectedEnv={selectedEnv}
                  selectedAlgo={selectedAlgo}
                  selectedCell={selectedCell}
                  drawGridEnvironment={drawGridEnvironment}
                  drawBreakout={drawBreakout}
                  drawCartPole={drawCartPole}
                  drawMountainCar={drawMountainCar}
                />
              </div>
            </Card>
            
            <Card hoverable={true}>
              <div style={{...styles.grid, ...styles.gridCols4, gap: '12px'}}>
                <ActionButton
                  onClick={isTraining ? (isPaused ? resumeTraining : pauseTraining) : startTraining}
                  icon={isTraining ? (isPaused ? Play : Pause) : Zap}
                  label={isTraining ? (isPaused ? 'Resume' : 'Pause') : 'Train'}
                  variant="primary"
                  disabled={selectedAlgo === 'td' && isTrained}
                  loading={isTraining && !isPaused}
                  size="medium"
                />
                
                <ActionButton
                  onClick={isPlaying ? (isPaused ? resumeInference : pauseInference) : startInference}
                  icon={isPlaying ? (isPaused ? Play : Pause) : Play}
                  label={isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Inference'}
                  variant="success"
                  disabled={!isTrained || selectedAlgo === 'td'}
                  size="medium"
                />
                
                <ActionButton
                  onClick={resetEnvironment}
                  icon={RotateCcw}
                  label="Reset"
                  variant="secondary"
                  size="medium"
                />
                
                <ActionButton
                  onClick={() => {
                    stopAllProcesses();
                    setIsTraining(false);
                    setIsPlaying(false);
                    setIsPaused(false);
                    initializeAgent();
                  }}
                  icon={RefreshCw}
                  label="New Agent"
                  variant="warning"
                  size="medium"
                />
              </div>
              
              {isTraining && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <span>Training Progress</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                      {episodeCount} / {params.episodes} episodes ({Math.round(trainingProgress)}%)
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${trainingProgress}%`}}></div>
                  </div>
                  
                  {metricsDisplay && metricsDisplay.length > 0 && (
                    <div style={{...styles.metricsGrid, marginTop: '16px'}}>
                      {metricsDisplay.map((metric, index) => (
                        <div key={index} style={styles.metricItem}>
                          <div style={styles.metricLabel}>{metric.label}</div>
                          <div style={styles.metricValue}>{metric.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
            
            <div style={{...styles.grid, gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
              {isTrained && agentSnapshot && selectedAlgo !== 'td' && (
                <Card hoverable={true}>
                  <SectionHeader 
                    title="Value Function" 
                    description="State values learned by the agent"
                  />
                  <ValueGrid 
                    values={agentSnapshot.values || 
                      (agentSnapshot.qTable ? agentSnapshot.qTable.map(q => Math.max(...q)) : new Array(env?.nStates || 0).fill(0))} 
                    size={Math.ceil(Math.sqrt(env?.nStates || 0))}
                    onCellClick={(cellIdx) => setSelectedCell(cellIdx)}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '16px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    <span>Click cells to inspect values</span>
                    {selectedCell !== null && (
                      <span style={{ fontFamily: 'monospace' }}>
                        State {selectedCell}: {(agentSnapshot.values?.[selectedCell] || (agentSnapshot.qTable ? Math.max(...agentSnapshot.qTable[selectedCell] || [0]) : 0)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </Card>
              )}
              
              <Card hoverable={true}>
                <SectionHeader 
                  title="Training Status" 
                  description="Current learning metrics"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={styles.statusGrid}>
                    <div style={styles.statusItem}>
                      <p style={styles.statusLabel}>Environment</p>
                      <p style={styles.statusValue}>{environments.find(e => e.id === selectedEnv)?.name || selectedEnv}</p>
                    </div>
                    <div style={styles.statusItem}>
                      <p style={styles.statusLabel}>Algorithm</p>
                      <p style={styles.statusValue}>{algorithms.find(a => a.id === selectedAlgo)?.name}</p>
                    </div>
                  </div>
                  
                  <div style={styles.statusItem}>
                    <p style={styles.statusLabel}>Current State</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{...styles.statusValue, fontFamily: 'monospace'}}>{currentState}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: isPlaying ? '#ffb300' : '#1976d2', 
                          borderRadius: '50%', 
                          animation: isPlaying ? 'pulse 1s infinite' : 'none' 
                        }}></div>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                          {isPlaying ? 'Active' : 'Ready'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{...styles.statusItem, backgroundColor: '#e3f2fd', border: '1px solid #bbdefb'}}>
                    <p style={{...styles.statusLabel, color: '#1976d2'}}>Learning Parameters</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '14px', color: '#1976d2' }}>
                      <span style={{ fontFamily: 'monospace' }}>γ = {params.gamma.toFixed(2)}</span>
                      {['qlearning', 'sarsa', 'td', 'nsteptd'].includes(selectedAlgo) && (
                        <span style={{ fontFamily: 'monospace' }}>α = {params.alpha.toFixed(2)}</span>
                      )}
                      {['qlearning', 'sarsa', 'montecarlo', 'nsteptd'].includes(selectedAlgo) && (
                        <span style={{ fontFamily: 'monospace' }}>ε = {params.epsilon.toFixed(2)}</span>
                      )}
                      {selectedAlgo === 'nsteptd' && (
                        <span style={{ fontFamily: 'monospace' }}>n = {params.nStep}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {trainingMetrics && (
              <Card hoverable={true}>
                <SectionHeader 
                  title="Training Metrics" 
                  description="Monitor learning progress"
                  icon={TrendingUp}
                />
                <MetricsChart 
                  metrics={trainingMetrics}
                  title="Learning Progress"
                  type={['policyiteration', 'valueiteration', 'policyevaluation'].includes(selectedAlgo) ? 'delta' : 'returns'}
                />
              </Card>
            )}
            
            <AlgorithmInfo algorithm={selectedAlgo} />
          </div>
        </div>
        
        {/* Legend Section */}
        <Card hoverable={true} style={{ marginTop: '32px' }}>
          <SectionHeader 
            title="Visual Legend" 
            description="Understanding the visualization elements"
            icon={Book}
          />
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, background: 'linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)', borderRadius: '50%'}}></div>
              <div>
                <p style={styles.legendText}>Agent</p>
                <p style={styles.legendSubtext}>Learning entity - current position</p>
              </div>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px'}}>
                🏆
              </div>
              <div>
                <p style={styles.legendText}>Goal State</p>
                <p style={styles.legendSubtext}>Target destination with positive reward</p>
              </div>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: '#d32f2f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px'}}>
                ⚠️
              </div>
              <div>
                <p style={styles.legendText}>Obstacle/Hole</p>
                <p style={styles.legendSubtext}>Avoid these states - negative reward</p>
              </div>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: '#1976d2'}}></div>
              <div>
                <p style={styles.legendText}>High Value</p>
                <p style={styles.legendSubtext}>Desirable states with high expected return</p>
              </div>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{ width: '16px', height: '2px', backgroundColor: '#1a1a1a' }}></div>
              </div>
              <div>
                <p style={styles.legendText}>Policy Arrow</p>
                <p style={styles.legendSubtext}>Optimal action from learned policy</p>
              </div>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendColor, background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 50%, #bbdefb 100%)'}}></div>
              <div>
                <p style={styles.legendText}>Value Gradient</p>
                <p style={styles.legendSubtext}>Darker blue = higher state value</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* لوحة إعدادات المكافآت */}
        {showRewardSettings && (
          <RewardSettingsPanel
            envType={selectedEnv}
            config={rewardConfig}
            onConfigChange={handleRewardConfigChange}
            onClose={() => setShowRewardSettings(false)}
          />
        )}
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.container}>
          <p style={styles.footerText}>Reinforcement Learning Visualizer • Designed for Educational Purposes</p>
          <p style={{...styles.footerText, marginTop: '8px', fontSize: '13px', color: '#888' }}>
            Interactive tool for understanding RL concepts and algorithms • All fixes applied: Real-time updates, N-step TD, Transition Models, Reward Customization
          </p>
        </div>
      </footer>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #1976d2;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            background: #1565c0;
            transform: scale(1.1);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #1976d2;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          button {
            transition: all 0.2s ease;
          }
          
          button:hover:not(:disabled) {
            transform: translateY(-2px);
          }
          
          .card-enter {
            animation: fadeIn 0.3s ease-out;
          }
          
          .tooltip {
            position: relative;
          }
          
          .tooltip:hover::after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
          }
        `}
      </style>
    </div>
  );
}