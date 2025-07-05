import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <img src="./logo-big.svg" alt="Mosaic" />
          </div>
          <div className="auth-buttons">
            <button 
              className="btn-register"
              onClick={() => navigate(ROUTES.AGENTS)}
            >
              Go to app
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 