import React, { useState, useEffect } from 'react';
import { Grid, Snowflake, Mountain, TrendingUp, Gamepad2, Sliders, X, RefreshCw, Book, Shield, Zap, AlertCircle } from 'lucide-react';

// EnvironmentCard Component
export const EnvironmentCard = ({ name, description, icon: Icon, selected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    textAlign: 'left',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    borderStyle: 'solid',
    position: 'relative',
    overflow: 'hidden',
    ...(selected ? {
      borderColor: '#1976d2',
      backgroundColor: '#e3f2fd',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
    } : {}),
    ...(isHovered && !selected ? {
      borderColor: '#bdbdbd',
      backgroundColor: '#f5f5f5',
      transform: 'translateY(-2px)'
    } : {})
  };
  
  const iconStyle = {
    padding: '8px',
    borderRadius: '6px',
    backgroundColor: '#f5f5f5',
    transition: 'all 0.2s ease',
    ...(selected ? {
      backgroundColor: '#bbdefb',
      transform: 'scale(1.1)'
    } : {}),
    ...(isHovered && !selected ? {
      transform: 'scale(1.05)'
    } : {})
  };
  
  return (
    <button
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={iconStyle}>
          <Icon size={20} color={selected ? '#1976d2' : '#666'} />
        </div>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0
          }}>{name}</h3>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '4px 0 0 0'
          }}>{description}</p>
        </div>
      </div>
    </button>
  );
};

// AlgorithmCard Component
export const AlgorithmCard = ({ name, description, category, selected, onClick, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    textAlign: 'left',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    borderStyle: 'solid',
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...(selected ? {
      borderColor: '#1976d2',
      backgroundColor: '#e3f2fd',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
    } : {}),
    ...(isHovered && !selected && !disabled ? {
      borderColor: '#bdbdbd',
      backgroundColor: '#f5f5f5',
      transform: 'translateY(-2px)'
    } : {})
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={cardStyle}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      disabled={disabled}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0
            }}>{name}</h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '4px 0 0 0'
            }}>{description}</p>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: disabled ? '#f5f5f5' :
                          category === 'DP' ? '#e3f2fd' :
                          category === 'MC' ? '#f3e5f5' :
                          '#e8f5e9',
            color: disabled ? '#999' : 
                   category === 'DP' ? '#1976d2' :
                   category === 'MC' ? '#7b1fa2' :
                   '#2e7d32',
            border: `1px solid ${disabled ? '#e0e0e0' : 
                    category === 'DP' ? '#bbdefb' :
                    category === 'MC' ? '#e1bee7' :
                    '#c8e6c9'}`
          }}>
            {category}
          </span>
        </div>
        {disabled && (
          <div style={{ 
            marginTop: '8px',
            fontSize: '12px',
            color: '#d32f2f',
            textAlign: 'left',
            padding: '4px',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            Requires transition model
          </div>
        )}
      </div>
    </button>
  );
};

// AlgorithmInfo Component
export const AlgorithmInfo = ({ algorithm }) => {
  const algorithmDetails = {
    policyevaluation: {
      name: "Policy Evaluation",
      category: "Dynamic Programming",
      description: "Evaluates the value function of a given policy by iteratively applying the Bellman expectation equation until convergence.",
      formula: "V_{k+1}(s) = ∑ π(a|s) ∑ P(s'|s,a)[R(s,a,s') + γV_k(s')]",
      features: [
        "Computes value function for a fixed policy",
        "Requires complete model of environment dynamics",
        "Iterative algorithm that converges to Vπ",
        "Used as a subroutine in Policy Iteration"
      ]
    },
    policyiteration: {
      name: "Policy Iteration",
      category: "Dynamic Programming",
      description: "An iterative algorithm that alternates between policy evaluation (computing the value function for a given policy) and policy improvement (making the policy greedy with respect to the value function) until convergence to an optimal policy.",
      formula: "V_{k+1}(s) = ∑ π(a|s) ∑ P(s'|s,a)[R(s,a,s') + γV_k(s')]",
      features: [
        "Guaranteed to converge to optimal policy",
        "Requires complete model of environment dynamics",
        "Suitable for environments with small state spaces",
        "Two-phase process: evaluation then improvement"
      ]
    },
    valueiteration: {
      name: "Value Iteration",
      category: "Dynamic Programming",
      description: "Computes optimal value function by iteratively applying Bellman optimality equation, then extracts optimal policy from the optimal value function.",
      formula: "V_{k+1}(s) = max_a ∑ P(s'|s,a)[R(s,a,s') + γV_k(s')]",
      features: [
        "Directly computes optimal value function",
        "Faster convergence than Policy Iteration in many cases",
        "Requires complete model of environment",
        "Combines policy evaluation and improvement"
      ]
    },
    montecarlo: {
      name: "Monte Carlo",
      category: "Model-Free",
      description: "Learns value functions and optimal policies from experience through sample returns, without requiring a model of the environment. Uses complete episodes for updates.",
      formula: "V(s) ← V(s) + α[G - V(s)] where G = ∑ γ^k R_{t+k+1}",
      features: [
        "Model-free: doesn't need environment dynamics",
        "Learns from complete episodes only",
        "High variance but unbiased estimates",
        "Can be used with function approximation"
      ]
    },
    td: {
      name: "TD(0)",
      category: "Temporal Difference",
      description: "One-step temporal difference learning that combines ideas from Monte Carlo and Dynamic Programming. Updates estimates based on other learned estimates.",
      formula: "V(s) ← V(s) + α[R + γV(s') - V(s)]",
      features: [
        "Learns online after every time step",
        "Lower variance than Monte Carlo methods",
        "Can learn without final outcome",
        "Bootstraps from current value estimates"
      ]
    },
    nsteptd: {
      name: "n-step TD",
      category: "Temporal Difference",
      description: "Generalization of TD methods that looks n steps into the future before updating. Balances bias and variance trade-off.",
      formula: "G_t^{(n)} = R_{t+1} + γR_{t+2} + ... + γ^{n-1}R_{t+n} + γ^nV(s_{t+n})",
      features: [
        "Intermediate between TD(0) and Monte Carlo",
        "Adjustable trade-off between bias and variance",
        "n=1 gives TD(0), n=∞ gives Monte Carlo",
        "Better performance with optimal n"
      ]
    },
    sarsa: {
      name: "SARSA",
      category: "On-Policy TD",
      description: "On-policy temporal difference control algorithm that learns action-value functions. The name comes from the sequence State-Action-Reward-State-Action.",
      formula: "Q(s,a) ← Q(s,a) + α[R + γQ(s',a') - Q(s,a)]",
      features: [
        "On-policy: learns about policy being followed",
        "Generally safer for online learning",
        "Converges to optimal with proper exploration",
        "Suitable for continuing tasks"
      ]
    },
    qlearning: {
      name: "Q-Learning",
      category: "Off-Policy TD",
      description: "Off-policy temporal difference control that learns optimal action-value function independently of the policy being followed. Uses maximum over next actions.",
      formula: "Q(s,a) ← Q(s,a) + α[R + γ max_a' Q(s',a') - Q(s,a)]",
      features: [
        "Off-policy: learns optimal while following any policy",
        "Directly approximates optimal action-value function",
        "Proven convergence under certain conditions",
        "Widely used in practice"
      ]
    }
  };

  const details = algorithmDetails[algorithm];

  if (!details) return null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
      padding: '24px',
      marginBottom: '20px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #bbdefb',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h4 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1976d2',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Book size={18} />
          {details.name} ({details.category})
        </h4>
        <p style={{
          fontSize: '14px',
          color: '#1976d2',
          marginBottom: '16px',
          lineHeight: 1.6
        }}>{details.description}</p>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '6px',
          border: '1px solid #e0e0e0',
          marginBottom: '16px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#1a1a1a',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <code style={{ margin: 0 }}>{details.formula}</code>
        </div>
        <ul style={{
          margin: 0,
          paddingLeft: '20px',
          fontSize: '14px',
          color: '#1976d2'
        }}>
          {details.features.map((feature, index) => (
            <li key={index} style={{
              marginBottom: '8px',
              lineHeight: 1.4,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '-15px',
                top: '6px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#1976d2'
              }}></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// RewardSettingsPanel Component
export const RewardSettingsPanel = ({ envType, config, onConfigChange, onClose }) => {
  const [localConfig, setLocalConfig] = useState(config);
  
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);
  
  const handleChange = (key, value) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };
  
  const getEnvSettings = () => {
    const baseSettings = {
      gridworld: [
        { key: 'goalReward', label: 'Goal Reward', min: -100, max: 100, step: 1, defaultValue: 10 },
        { key: 'stepPenalty', label: 'Step Penalty', min: -10, max: 0, step: 0.1, defaultValue: -0.1 },
        { key: 'obstaclePenalty', label: 'Obstacle Penalty', min: -100, max: 0, step: 1, defaultValue: -1 }
      ],
      frozenlake: [
        { key: 'goalReward', label: 'Goal Reward', min: -100, max: 100, step: 1, defaultValue: 1 },
        { key: 'holePenalty', label: 'Hole Penalty', min: -100, max: 0, step: 1, defaultValue: -1 },
        { key: 'stepPenalty', label: 'Step Penalty', min: -1, max: 0, step: 0.01, defaultValue: -0.01 }
      ],
      cartpole: [
        { key: 'stepReward', label: 'Step Reward', min: 0, max: 10, step: 0.1, defaultValue: 1 },
        { key: 'failPenalty', label: 'Fail Penalty', min: -100, max: 0, step: 1, defaultValue: 0 },
        { key: 'maxSteps', label: 'Max Steps', min: 10, max: 1000, step: 10, defaultValue: 200 }
      ],
      mountaincar: [
        { key: 'goalReward', label: 'Goal Reward', min: -100, max: 100, step: 1, defaultValue: 0 },
        { key: 'stepPenalty', label: 'Step Penalty', min: -10, max: 0, step: 0.1, defaultValue: -1 },
        { key: 'maxSteps', label: 'Max Steps', min: 10, max: 1000, step: 10, defaultValue: 200 }
      ],
      breakout: [
        { key: 'brickReward', label: 'Brick Reward', min: 0, max: 10, step: 0.1, defaultValue: 1 },
        { key: 'missPenalty', label: 'Miss Penalty', min: -10, max: 0, step: 0.1, defaultValue: -1 },
        { key: 'stepPenalty', label: 'Step Penalty', min: -1, max: 0, step: 0.01, defaultValue: -0.1 },
        { key: 'winReward', label: 'Win Reward', min: 0, max: 100, step: 1, defaultValue: 10 }
      ]
    };
    
    return baseSettings[envType] || [];
  };
  
  const settings = getEnvSettings();
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '350px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '-2px 0 20px rgba(0,0,0,0.15)',
      zIndex: 1000,
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={24} />
            Reward Settings
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
            Customize environment rewards
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            padding: '8px',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <X size={20} />
        </button>
      </div>
      
      <div style={{ flex: 1 }}>
        {settings.map(setting => (
          <div key={setting.key} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333'
                }}>{setting.label}</span>
                <span style={{
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  backgroundColor: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {(localConfig[setting.key] !== undefined ? localConfig[setting.key] : setting.defaultValue).toFixed(setting.step < 1 ? 2 : 0)}
                </span>
              </div>
              <input
                type="range"
                min={setting.min}
                max={setting.max}
                step={setting.step}
                value={localConfig[setting.key] !== undefined ? localConfig[setting.key] : setting.defaultValue}
                onChange={(e) => handleChange(setting.key, parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#e0e0e0',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '4px',
                fontStyle: 'italic'
              }}>{`Default: ${setting.defaultValue}`}</p>
            </div>
          </div>
        ))}
        
        {settings.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px dashed #e0e0e0'
          }}>
            <Sliders size={48} color="#999" style={{ marginBottom: '16px' }} />
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              No custom reward settings available for this environment
            </p>
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '24px', 
        paddingTop: '20px', 
        borderTop: '2px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <button
          onClick={() => {
            const defaults = {};
            settings.forEach(s => defaults[s.key] = s.defaultValue);
            setLocalConfig(defaults);
            onConfigChange(defaults);
          }}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e0e0e0';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f5f5f5';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <RefreshCw size={16} />
          Reset to Defaults
        </button>
        
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#1976d2',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: 'white',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1565c0';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#1976d2';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};