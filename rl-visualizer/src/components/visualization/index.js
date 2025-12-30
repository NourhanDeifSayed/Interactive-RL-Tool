import React, { useEffect, useRef } from 'react';

export const CanvasRenderer = ({ env, agentSnapshot, currentState, isTrained, isPlaying, selectedEnv, selectedAlgo, selectedCell, drawGridEnvironment, drawBreakout, drawCartPole, drawMountainCar }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  const drawEnvironment = () => {
    const canvas = canvasRef.current;
    if (!canvas || !env) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    
    if (width > 0 && height > 0) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f8f9fa');
      gradient.addColorStop(1, '#e9ecef');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    if (selectedEnv === 'gridworld' || selectedEnv === 'frozenlake') {
      drawGridEnvironment(ctx, width, height);
    } else if (selectedEnv === 'cartpole') {
      drawCartPole(ctx, width, height);
    } else if (selectedEnv === 'mountaincar') {
      drawMountainCar(ctx, width, height);
    } else if (selectedEnv === 'breakout') {
      drawBreakout(ctx, width, height);
    }
  };
  
  useEffect(() => {
    const animate = () => {
      drawEnvironment();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [env, agentSnapshot, currentState, isTrained, selectedEnv, selectedAlgo, selectedCell, drawGridEnvironment, drawBreakout, drawCartPole, drawMountainCar]);
  
  useEffect(() => {
    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(() => {
          drawEnvironment();
        });
      }
    };
    
    const container = canvasRef.current?.parentElement;
    if (container) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }}
    />
  );
};

export const MetricsChart = ({ metrics, title, type = 'returns' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    if (!metrics) return;
    
    let data = [];
    let color = '#1976d2';
    let label = 'Value';
    
    if (type === 'returns' && metrics.episodeReturns) {
      data = metrics.episodeReturns;
      color = '#2e7d32';
      label = 'Episode Return';
    } else if (type === 'delta' && metrics.deltaHistory) {
      data = metrics.deltaHistory;
      color = '#d32f2f';
      label = 'ΔV';
    } else if (type === 'steps' && metrics.stepCountHistory) {
      data = metrics.stepCountHistory;
      color = '#f57c00';
      label = 'Steps';
    }
    
    if (data.length === 0) return;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const valueRange = maxValue - minValue || 1;
    
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    const xStep = chartWidth / 10;
    for (let i = 0; i <= 10; i++) {
      const x = padding + i * xStep;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    const yStep = chartHeight / 5;
    for (let i = 0; i <= 5; i++) {
      const y = padding + i * yStep;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    ctx.fillStyle = color;
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Iteration', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(label, 0, 0);
    ctx.restore();
    
    ctx.fillStyle = '#666';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(maxValue.toFixed(2), padding - 5, padding + 10);
    ctx.fillText(minValue.toFixed(2), padding - 5, height - padding - 5);
    
    ctx.textAlign = 'left';
    ctx.fillText(`n = ${data.length}`, padding + 5, padding + 10);
    
    if (type === 'returns' && data.length > 0) {
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      ctx.fillText(`avg = ${avg.toFixed(2)}`, padding + 5, padding + 25);
    }
  }, [metrics, type]);
  
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      marginTop: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          margin: 0
        }}>{title}</h4>
        <span style={{
          fontSize: '12px',
          color: '#666',
          backgroundColor: '#f5f5f5',
          padding: '4px 8px',
          borderRadius: '12px'
        }}>
          {type === 'returns' ? 'Episode Returns' : 
           type === 'delta' ? 'Convergence' : 'Steps per Episode'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{ width: '100%', height: '200px' }}
      />
    </div>
  );
};