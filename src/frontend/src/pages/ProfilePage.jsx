import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import HeaderPrivy from '../components/HeaderPrivy';
import Footer from '../components/Footer';
import walrusService from '../services/walrusService';

const ProfilePage = () => {
  const { user, authenticated } = usePrivy();
  const navigate = useNavigate();
  const [userAgents, setUserAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's agents from Walrus
  useEffect(() => {
    const loadUserAgents = async () => {
      if (!authenticated) return;
      
      try {
        setLoading(true);
        // Get stored blob IDs from localStorage
        const storedBlobIds = JSON.parse(localStorage.getItem('agentBlobIds') || '[]');
        
        // Fetch agent data from Walrus for each blob ID
        const agentPromises = storedBlobIds.map(async (blobId) => {
          try {
            const agentData = await walrusService.getAgentData(blobId);
            return { ...agentData, blobId };
          } catch (error) {
            console.error(`Error fetching agent with blob ID ${blobId}:`, error);
            return null;
          }
        });

        const agentResults = await Promise.all(agentPromises);
        const validAgents = agentResults.filter(agent => agent !== null);
        setUserAgents(validAgents);
      } catch (error) {
        console.error('Error loading user agents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAgents();
  }, [authenticated]);

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
          
          <div className="profile-sections-grid">
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

            <div className="profile-section">
              <h2>Agent Management</h2>
              <div className="profile-info">
                <div className="info-item">
                  <span className="label">My Agents</span>
                  <span className="value">{userAgents.length} agents created</span>
                </div>
                <div className="info-item">
                  <span className="label">Create New Agent</span>
                  <div className="value">
                    <button 
                      className="btn-primary" 
                      onClick={() => navigate(ROUTES.CREATE_AGENT)}
                    >
                      Create New Agent
                    </button>
                  </div>
                </div>
                <div className="info-item">
                  <span className="label">Browse Agents</span>
                  <div className="value">
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

            {/* User's Created Agents Section */}
            <div className="profile-section full-width">
              <h2>Your Created Agents</h2>
              <div className="user-agents-grid">
                {loading ? (
                  <div className="loading-message">
                    <div className="loading-spinner"></div>
                    <p>Loading your agents...</p>
                  </div>
                ) : userAgents.length === 0 ? (
                  <div className="empty-agents-message">
                    <p>You haven't created any agents yet.</p>
                    <button 
                      className="btn-primary" 
                      onClick={() => navigate(ROUTES.CREATE_AGENT)}
                    >
                      Create Your First Agent
                    </button>
                  </div>
                ) : (
                  userAgents.map(agent => (
                    <div key={agent.blobId} className="user-agent-card">
                      <div className="agent-card-header">
                        <div className="agent-avatar">{agent.avatar}</div>
                        <div className="agent-info">
                          <h3>{agent.name}</h3>
                          <p className="agent-category">{agent.category}</p>
                          <p className="agent-price">USDC {agent.price}/hour</p>
                        </div>
                      </div>
                      <p className="agent-description">{agent.description}</p>
                      <div className="agent-actions">
                        <button 
                          className="btn-secondary"
                          onClick={() => navigate(`/agents/${agent.blobId}`)}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn-primary"
                          onClick={() => {
                            // TODO: Add edit functionality
                            console.log('Edit agent:', agent.blobId);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="agent-meta">
                        <small>Created: {new Date(agent.createdAt).toLocaleDateString()}</small>
                        <small>Stored on Walrus: {agent.blobId}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage; 