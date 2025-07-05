import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/agents">Search agents</a></li>
              <li><a href="/agents/create">Create Agent</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://mosaic-7.gitbook.io/mosaic-docs">Docs</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Mosaic.</p>
          <div className="footer-links">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 