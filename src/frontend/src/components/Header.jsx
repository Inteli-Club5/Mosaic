import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container">
        <div className="nav-wrapper">
          <a href={ROUTES.HOME} className="logo-link">
            <div className="logo">
              <img src="./logo-big.svg" alt="Mosaic" />
            </div>
          </a>
          <div className="auth-buttons">
            <button 
              className="btn-register"
              onClick={() => navigate(ROUTES.AGENTS)}
            >
              Go to dApp
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 