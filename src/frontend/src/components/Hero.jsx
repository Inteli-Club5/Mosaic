import React from 'react';

const Hero = ({ title, subtitle }) => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default Hero; 