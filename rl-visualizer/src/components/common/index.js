import React, { useState } from 'react';
import { Shield, Zap, AlertCircle, Play, Pause } from 'lucide-react';

// Card Component
export const Card = ({ children, style = {}, hoverable = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
    padding: '24px',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    ...style,
    ...(hoverable && isHovered ? {
      boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
      transform: 'translateY(-2px)'
    } : {})
  };
  
  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => hoverable && setIsHovered(false)}
    >
      {children}
    </div>
  );
};

// SectionHeader Component
export const SectionHeader = ({ title, description, icon: Icon }) => (
  <div style={{
    marginBottom: '24px'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: '0 0 8px 0'
    }}>
      {Icon && <Icon size={24} color="#1976d2" />}
      {title}
    </div>
    {description && <p style={{
      fontSize: '14px',
      color: '#666',
      margin: 0,
      lineHeight: 1.6
    }}>{description}</p>}
  </div>
);

// ParameterSlider Component
export const ParameterSlider = ({ label, value, min, max, step, onChange, description, unit = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#e0e0e0',
    outline: 'none',
    WebkitAppearance: 'none',
    transition: 'all 0.2s ease',
    background: isHovered 
      ? `linear-gradient(90deg, #1976d2 ${((value - min) / (max - min)) * 100}%, #e0e0e2 ${((value - min) / (max - min)) * 100}%)`
      : '#e0e0e0'
  };
  
  return (
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
        }}>{label}</span>
        <span style={{
          fontSize: '14px',
          fontFamily: 'monospace',
          backgroundColor: '#f5f5f5',
          padding: '4px 8px',
          borderRadius: '4px',
          minWidth: '60px',
          textAlign: 'center'
        }}>
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={sliderStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {description && <p style={{
        fontSize: '12px',
        color: '#666',
        marginTop: '4px',
        fontStyle: 'italic'
      }}>{description}</p>}
    </div>
  );
};

// ActionButton Component
export const ActionButton = ({ onClick, icon: Icon, label, variant = 'primary', disabled = false, loading = false, size = 'medium' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const buttonStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    ...(size === 'small' ? { padding: '8px 12px', fontSize: '14px' } : {}),
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: isHovered && !disabled && !loading ? 
      (variant === 'primary' ? '#1565c0' :
       variant === 'success' ? '#1b5e20' :
       variant === 'warning' ? '#e65100' :
       variant === 'danger' ? '#b71c1c' :
       '#424242') :
      (variant === 'primary' ? '#1976d2' :
       variant === 'success' ? '#2e7d32' :
       variant === 'warning' ? '#f57c00' :
       variant === 'danger' ? '#d32f2f' :
       '#616161'),
    transform: isHovered && !disabled && !loading ? 'translateY(-2px)' : 'none'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={buttonStyle}
      onMouseEnter={() => !disabled && !loading && setIsHovered(true)}
      onMouseLeave={() => !disabled && !loading && setIsHovered(false)}
    >
      {loading ? (
        <>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

// StatusBadge Component
export const StatusBadge = ({ status, label }) => {
  const badgeStyles = {
    trained: { 
      backgroundColor: '#e8f5e9', 
      color: '#2e7d32',
      border: '1px solid #c8e6c9'
    },
    training: { 
      backgroundColor: '#fff3e0', 
      color: '#f57c00',
      border: '1px solid #ffe0b2'
    },
    idle: { 
      backgroundColor: '#f5f5f5', 
      color: '#616161',
      border: '1px solid #e0e0e0'
    },
    running: { 
      backgroundColor: '#e3f2fd', 
      color: '#1976d2',
      border: '1px solid #bbdefb'
    },
    paused: { 
      backgroundColor: '#f3e5f5', 
      color: '#7b1fa2',
      border: '1px solid #e1bee7'
    },
    error: { 
      backgroundColor: '#ffebee', 
      color: '#d32f2f',
      border: '1px solid #ffcdd2'
    }
  };

  const config = badgeStyles[status] || badgeStyles.idle;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      ...config
    }}>
      {status === 'trained' && <Shield size={16} />}
      {status === 'training' && <Zap size={16} />}
      {status === 'idle' && <AlertCircle size={16} />}
      {status === 'running' && <Play size={16} />}
      {status === 'paused' && <Pause size={16} />}
      {status === 'error' && <AlertCircle size={16} />}
      <span>{label}</span>
    </div>
  );
};

// ValueGrid Component
export const ValueGrid = ({ values, size = 8, onCellClick }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{
        display: 'grid',
        gap: '4px',
        gridTemplateColumns: `repeat(${size}, 1fr)`
      }}>
        {values.map((value, idx) => {
          const safeValue = isFinite(value) ? value : 0;
          const filteredValues = values.filter(v => isFinite(v));
          const maxValue = filteredValues.length > 0 ? Math.max(...filteredValues) : 0;
          const minValue = filteredValues.length > 0 ? Math.min(...filteredValues) : 0;
          const normalized = maxValue !== minValue ? (safeValue - minValue) / (maxValue - minValue) : 0.5;
          const isHovered = hoveredCell === idx;
          
          return (
            <div
              key={idx}
              style={{
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontFamily: 'monospace',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: `rgba(25, 118, 210, ${normalized})`,
                color: normalized > 0.5 ? 'white' : '#1a1a1a',
                boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                transform: isHovered ? 'scale(1.05)' : 'none',
                zIndex: isHovered ? 1 : 'auto'
              }}
              title={`State ${idx}: ${safeValue.toFixed(2)}`}
              onMouseEnter={() => setHoveredCell(idx)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => onCellClick && onCellClick(idx)}
            >
              {safeValue.toFixed(1)}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  marginTop: '4px'
                }}>
                  State {idx}: {safeValue.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};