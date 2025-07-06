import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes';
import { usePrivy } from "@privy-io/react-auth";

const HeaderPrivy = () => {
  const navigate = useNavigate();
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) return null;

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
            {authenticated ? (
              <button
                onClick={() => navigate('/profile')}
                className="btn-register"
              >
                Connected
              </button>
            ) : (
              <button onClick={login} className="btn-register">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderPrivy; 