import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Find Your Agent',
      description: 'Browse through our curated collection of specialized AI agents or use our intelligent search to find the perfect match for your needs.'
    },
    {
      number: '2',
      title: 'Connect & Chat',
      description: 'Start a conversation with your chosen agent. Our platform ensures seamless communication with instant responses and context awareness.'
    },
    {
      number: '3',
      title: 'Get Results',
      description: 'Receive expert assistance, insights, and solutions tailored to your specific requirements. Track progress and manage your interactions.'
    }
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <h2>How It Works</h2>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 