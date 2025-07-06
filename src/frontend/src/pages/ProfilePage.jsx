import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import HeaderPrivy from '../components/HeaderPrivy';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const { user, authenticated } = usePrivy();
  const navigate = useNavigate();

  if (!authenticated) {
    return (
      <div className="profile-page">
        <HeaderPrivy />
        <div className="container">
          <div className="profile-content">
            <h1>Please login to view your profile</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <HeaderPrivy />
      <div className="container">
        <div className="profile-content">
          <h1>Profile</h1>
          
          <div className="profile-section">
            <h2>User Information</h2>
            <div className="profile-info">
              <div className="info-item">
                <span className="label">User ID:</span>
                <span className="value">{user?.id || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{user?.email?.address || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Created:</span>
                <span className="value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Wallet Information</h2>
            <div className="profile-info">
              {user?.wallet?.address ? (
                <div className="info-item">
                  <span className="label">Wallet Address:</span>
                  <span className="value wallet-address">
                    {user.wallet.address}
                  </span>
                </div>
              ) : (
                <div className="info-item">
                  <span className="label">Wallet:</span>
                  <span className="value">No wallet connected</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>Account Details</h2>
            <div className="profile-info">
              <div className="info-item">
                <span className="label">Login Method:</span>
                <span className="value">{user?.loginMethod || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Linked Accounts:</span>
                <span className="value">{user?.linkedAccounts?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-section">
        <h2>Agent Management</h2>
        <div className="profile-info">
          <div className="info-item">
            <span className="label">Actions:</span>
            <div className="value">
              <button 
                className="btn-primary" 
                onClick={() => navigate(ROUTES.CREATE_AGENT)}
                style={{ marginRight: '1rem' }}
              >
                Create New Agent
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate(ROUTES.AGENTS)}
              >
                View All Agents
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage; 