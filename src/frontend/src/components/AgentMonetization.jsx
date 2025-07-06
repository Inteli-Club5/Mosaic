import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const AgentMonetization = () => {
  const [activeEarning, setActiveEarning] = useState(0);
  const navigate = useNavigate();

  const earningModels = [
    {
      title: "Pay-Per-Use",
      description: "Earn every time someone uses your agent",
      icon: "💰",
      details: "Set your price per interaction, from $0.01 to $10+",
      example: "$0.50 per analysis",
      potential: "$500-5,000/month"
    },
    {
      title: "Subscription Model",
      description: "Recurring revenue from premium features",
      icon: "🔄",
      details: "Monthly or yearly subscriptions for advanced capabilities",
      example: "$19.99/month premium",
      potential: "$2,000-20,000/month"
    },
    {
      title: "Marketplace Revenue",
      description: "Featured placement and promotion fees",
      icon: "🏪",
      details: "Get featured in our marketplace for maximum visibility",
      example: "20% revenue share",
      potential: "$1,000-15,000/month"
    },
    {
      title: "Enterprise Licensing",
      description: "Custom solutions for large organizations",
      icon: "🏢",
      details: "License your agent technology to enterprises",
      example: "$50,000+ licenses",
      potential: "$10,000-100,000+/month"
    }
  ];

  const stats = [
    { number: "$100K+", label: "Total Earnings Paid", category: "earnings" },
    { number: "3,000+", label: "Active Creators", category: "creators" },
    { number: "85%", label: "Revenue Share", category: "revenue" }
  ];

  const successStories = [
    {
      name: "Sarah Chen",
      specialty: "Marketing Analytics",
      earnings: "$12,500/month",
      story: "My marketing analysis agent processes 2,000+ requests daily",
      avatar: "👩‍💼"
    },
    {
      name: "Alex Rodriguez", 
      specialty: "Code Review",
      earnings: "$8,200/month",
      story: "Enterprise teams love my automated code review agent",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Watson",
      specialty: "Content Creation",
      earnings: "$15,300/month",
      story: "Content creators use my agent for blog post generation",
      avatar: "✍️"
    }
  ];

  return (
    <section className="agent-monetization">
      <div className="container">
        <div className="section-header">
          <h2>Turn Your AI Agents Into Revenue Streams</h2>
          <p>Create once, earn forever. Build intelligent agents and generate passive income while helping others solve complex problems.</p>
        </div>

        <div className="monetization-stats">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-card-${stat.category}`}>
              <div className="stat-content">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
              <div className="stat-indicator"></div>
            </div>
          ))}
        </div>

        <div className="monetization-steps">
          <h3>Start Earning in 3 Steps</h3>
          <div className="steps-flow">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Create Your Agent</h4>
                <p>Design and train your specialized AI agent using our intuitive platform</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Set Your Pricing</h4>
                <p>Choose your monetization model and set competitive pricing</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Start Earning</h4>
                <p>Deploy to marketplace and watch your passive income grow</p>
              </div>
            </div>
          </div>
        </div>

        <div className="monetization-cta">
          <h3>Ready to Monetize Your Expertise?</h3>
          <p>Join our creator economy and start building profitable AI agents today</p>
          <div className="cta-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate(ROUTES.CREATE_AGENT)}
            >
              Start Building & Earning
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate(ROUTES.AGENTS)}
            >
              View Creator Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentMonetization; 