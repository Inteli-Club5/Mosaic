import React from 'react';

const Header = ({ showGoToApp = true }) => {
  return (
    <header>
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <img src="./logo.png" alt="Mosaic Logo" />
          </div>
          {showGoToApp && (
            <div className="auth-buttons">
              <button href="" className="btn-register">Go to app</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 