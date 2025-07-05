import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
         <center>
        <div className="footer-content">
          <div className="footer-section">
            <h4>AI</h4>
            <ul>
              <li><a href="/agents">Agents Explorer</a></li>
              <li><a href="/agents/create">Agents Creator</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://mosaic-7.gitbook.io/mosaic-docs">Docs</a></li>
              <li><a href="https://github.com/Inteli-Club5/Mosaic">Github</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Mosaic. All rights reserved</p>
        </div>
        </center>
      </div>
    </footer>
  );
};

export default Footer; 