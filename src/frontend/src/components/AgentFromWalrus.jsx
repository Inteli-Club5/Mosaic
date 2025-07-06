import React, { useState, useEffect } from 'react';
import walrusService from '../services/walrusService';

const AgentFromWalrus = ({ blobId }) => {
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgent = async () => {
            if (!blobId) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const agentData = await walrusService.getAgentData(blobId);
                setAgent(agentData);
            } catch (err) {
                console.error('Error fetching agent from Walrus:', err);
                setError('Failed to load agent data');
            } finally {
                setLoading(false);
            }
        };

        fetchAgent();
    }, [blobId]);

    if (loading) {
        return (
            <div className="agent-card loading">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading agent from Walrus...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="agent-card error">
                <div className="error-content">
                    <p>❌ {error}</p>
                    <small>Blob ID: {blobId}</small>
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="agent-card empty">
                <p>No agent data found</p>
            </div>
        );
    }

    return (
        <div className="agent-card">
            <div className="agent-card-header">
                <div className="agent-avatar">{agent.avatar || '🤖'}</div>
                <div className="agent-main-info">
                    <h3 className="agent-name">
                        {agent.name}
                        <span className="verified-badge">✓</span>
                    </h3>
                    <div className="agent-category">{agent.category}</div>
                    <div className="agent-created">
                        Created: {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <p className="agent-description">{agent.description}</p>

            {agent.specialties && agent.specialties.length > 0 && (
                <div className="agent-specialties">
                    <h4>Specialties:</h4>
                    <div className="specialties-tags">
                        {agent.specialties.map((specialty, index) => (
                            <span key={index} className="specialty-tag">
                                {specialty}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {agent.keyFeatures && (
                <div className="agent-features">
                    <h4>Key Features:</h4>
                    <p>{agent.keyFeatures}</p>
                </div>
            )}

            <div className="agent-footer">
                <div className="agent-price">
                    USDC {agent.price}/hour
                </div>
                <div className="agent-status">
                    <span className={`status-badge ${agent.status}`}>
                        {agent.status}
                    </span>
                </div>
            </div>

            <div className="agent-actions">
                <button className="btn-primary">
                    Purchase Access
                </button>
                <button className="btn-secondary">
                    View Details
                </button>
            </div>

            <div className="agent-meta">
                <small>
                    Stored on Walrus: {blobId}
                </small>
            </div>
        </div>
    );
};

// Example usage component
export const AgentListFromWalrus = ({ blobIds = [] }) => {
    if (!blobIds.length) {
        return (
            <div className="agent-list empty">
                <p>No agents found</p>
            </div>
        );
    }

    return (
        <div className="agent-list">
            {blobIds.map((blobId) => (
                <AgentFromWalrus key={blobId} blobId={blobId} />
            ))}
        </div>
    );
};

// Example CSS (add this to your CSS file)
export const AgentFromWalrusCSS = `
.agent-card {
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.agent-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.agent-card.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
}

.loading-content {
    text-align: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.agent-card.error {
    border-color: #e74c3c;
    background-color: #fdf2f2;
}

.agent-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.agent-avatar {
    font-size: 48px;
    margin-right: 15px;
}

.agent-main-info {
    flex: 1;
}

.agent-name {
    margin: 0;
    font-size: 1.4em;
    color: #2c3e50;
}

.verified-badge {
    color: #27ae60;
    margin-left: 5px;
}

.agent-category {
    color: #7f8c8d;
    font-size: 0.9em;
}

.agent-created {
    color: #95a5a6;
    font-size: 0.8em;
    margin-top: 5px;
}

.agent-description {
    color: #34495e;
    line-height: 1.6;
    margin-bottom: 15px;
}

.agent-specialties {
    margin-bottom: 15px;
}

.agent-specialties h4 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 0.9em;
}

.specialties-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.specialty-tag {
    background: #3498db;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
}

.agent-features {
    margin-bottom: 15px;
}

.agent-features h4 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 0.9em;
}

.agent-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.agent-price {
    font-size: 1.2em;
    font-weight: bold;
    color: #27ae60;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    text-transform: uppercase;
}

.status-badge.active {
    background: #d4edda;
    color: #155724;
}

.agent-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.btn-primary, .btn-secondary {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #3498db;
    color: white;
}

.btn-primary:hover {
    background: #2980b9;
}

.btn-secondary {
    background: #ecf0f1;
    color: #2c3e50;
}

.btn-secondary:hover {
    background: #bdc3c7;
}

.agent-meta {
    border-top: 1px solid #ecf0f1;
    padding-top: 10px;
    text-align: center;
}

.agent-meta small {
    color: #95a5a6;
    font-size: 0.8em;
}
`;

export default AgentFromWalrus; 