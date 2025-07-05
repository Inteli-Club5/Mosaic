import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import TypingText from './TypingText';

const NoCodeSection = () => {
  const [currentPhase, setCurrentPhase] = useState('before');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [typingKey, setTypingKey] = useState(0);
  const navigate = useNavigate();

  const resetToNextPhase = useCallback(() => {
    setIsTransitioning(true);
    
    // Brief pause to show completion
    setTimeout(() => {
      // Switch phase and reset everything
      setCurrentPhase(prev => prev === 'before' ? 'after' : 'before');
      setAnimationProgress(0);
      setTypingKey(prev => prev + 1);
      setIsTransitioning(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isTransitioning) return;

    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          resetToNextPhase();
          return 100;
        }
        // Slower progress for 'after' phase to give more time to read
        const increment = currentPhase === 'after' ? 0.3 : 0.8;
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [resetToNextPhase, isTransitioning, currentPhase]);

  const beforeCode = `class MarketingAgent {
  constructor() {
    this.skills = ["SEO", "Analytics", "Campaigns"];
    this.apiKeys = new Map();

    // ... 60+ MORE CONFIG LINES

  }
  
  async analyzeMarket(data) {
    try {

      // + LINES FOR DATA VALIDATION

      // 100+ LINES FOR  PROCESSING LOGIC

    } catch (error) {
      this.errorHandler.log(error);
      throw error;
    }
  }`;

  const afterCode = `just type what you want the agent to do :)`;

  const transformationSteps = [
    { 
      phase: 'before', 
      text: 'Complex Manual Coding', 
      color: '#ef4444',
      emoji: '😤'
    },
    { 
      phase: 'after', 
      text: 'Simple AI Creation', 
      color: '#10b981',
      emoji: '✨'
    }
  ];

  const getCurrentStep = () => {
    if (isTransitioning) {
      // During transition, show the step we're transitioning TO
      return currentPhase === 'before' ? 1 : 0;
    }
    return currentPhase === 'before' ? 0 : 1;
  };

  const getCurrentDisplayCode = () => {
    if (isTransitioning) {
      // During transition, show the code we're transitioning TO
      return currentPhase === 'before' ? afterCode : beforeCode;
    }
    return currentPhase === 'before' ? beforeCode : afterCode;
  };

  const getPhaseMessage = () => {
    if (isTransitioning) return "🪄 Transforming...";
    if (currentPhase === 'before') return "😤 Complex Code";
    return "✨ Simple AI";
  };

  return (
    <section className="no-code-section">
      <div className="container">
        <div className="section-header">
          <h2>No More Coding Every Agent</h2>
          <p>Watch complex agent development transform into simple AI creation. No more thousands of lines of code.</p>
        </div>

        <div className="code-comparison-wrapper">
          <div className="code-comparison-text">
            <h3>From Complex to Simple</h3>
            <p>Stop writing endless boilerplate code. Our AI understands what you need and creates specialized agents instantly.</p>
            
            <div className="transformation-progress">
              <div className="progress-steps">
                {transformationSteps.map((step, index) => (
                  <div 
                    key={step.phase}
                    className={`progress-step ${getCurrentStep() === index ? 'active' : ''} ${getCurrentStep() > index ? 'completed' : ''}`}
                  >
                    <div className="step-indicator" style={{ backgroundColor: step.color }}>
                      {getCurrentStep() > index ? '✓' : step.emoji}
                    </div>
                    <span className="step-text">{step.text}</span>
                  </div>
                ))}
              </div>
              <div className="transformation-bar">
                <div 
                  className="transformation-fill"
                  style={{ 
                    width: `${animationProgress}%`,
                    background: currentPhase === 'before' 
                      ? `linear-gradient(90deg, #ef4444 0%, #8b5cf6 100%)` 
                      : `linear-gradient(90deg, #8b5cf6 0%, #10b981 100%)`,
                    transition: 'width 0.2s ease-out'
                  }}
                />
              </div>
            </div>

            <div className="transformation-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <span>100x Faster Development</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🧠</span>
                <span>AI-Powered Intelligence</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔧</span>
                <span>Zero Configuration</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🚀</span>
                <span>Production Ready</span>
              </div>
            </div>
          </div>

          <div className={`code-display ${isTransitioning ? 'transitioning' : ''}`}>
            <div className="code-header">
              <div className="code-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="file-name">
                {getCurrentDisplayCode() === beforeCode ? '💀 traditional-agent.js' : '✨ ai-agent.js'}
              </span>
              <div className="transformation-indicator">
                <span className={`phase-indicator ${isTransitioning ? 'transforming' : currentPhase}`}>
                  {getPhaseMessage()}
                </span>
              </div>
            </div>
            <div className="code-content">
              <TypingText
                text={getCurrentDisplayCode()}
                delay={getCurrentDisplayCode() === beforeCode ? 12 : 80}
                repeat={false}
                className="code-text"
                cursor={<span className="typing-cursor">|</span>}
                key={`${currentPhase}-${typingKey}`}
              />
            </div>
          </div>
        </div>

        <div className="cta-code">
          <h3>Ready to Transform Your Development?</h3>
          <p>Join thousands of developers building intelligent agents without the complexity</p>
          <div className="cta-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate(ROUTES.CREATE_AGENT)}
            >
              Start Creating Agents
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate(ROUTES.AGENTS)}
            >
              See Live Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoCodeSection; 