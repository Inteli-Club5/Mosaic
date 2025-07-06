import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ROUTES } from '../constants/routes';
import HeaderPrivy from '../components/HeaderPrivy';
import Footer from '../components/Footer';
import walrusService from '../services/walrusService';

const CreateAgentPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        avatar: '',
        description: '',
        price: '',
        specialties: [],
        keyFeatures: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user, connectWallet } = usePrivy();
    const { wallets } = useWallets();

    const categories = [
        'Data Analysis',
        'Marketing',
        'Finance',
        'Development',
        'Design',
        'Consulting',
        'Education',
        'Healthcare',
        'Legal',
        'Others'
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (isStepValid()) {
            setIsSubmitting(true);
            try {
                // Check if user has wallet connected for receiving payments
                if (wallets.length === 0) {
                    alert('Please connect a wallet to receive payments for your agent. You will be redirected to connect your wallet.');
                    try {
                        await connectWallet();
                        // After wallet connection, user can continue with the submission
                    } catch (error) {
                        console.error('Error connecting wallet:', error);
                        alert('Wallet connection failed. Please try again.');
                        return;
                    }
                }

                const primaryWallet = wallets[0];

                // Prepare agent data for Walrus storage
                const agentData = {
                    ...formData,
                    createdAt: new Date().toISOString(),
                    id: Date.now().toString(), // Temporary ID generation
                    status: 'active',
                    createdBy: user?.id || 'anonymous',
                    ownerWallet: primaryWallet?.address || null,
                    ownerEmail: user?.email?.address || null,
                    paymentWallet: primaryWallet?.address || null, // Wallet for receiving payments
                    chainId: primaryWallet?.chainId || null
                };

                // Store agent data on Walrus
                const blobId = await walrusService.storeAgentData(agentData);

                // Create NFT metadata structure
                const nftMetadata = {
                    name: formData.name,
                    description: formData.description,
                    image: formData.avatar,
                    attributes: [
                        { trait_type: "Category", value: formData.category },
                        { trait_type: "Price", value: `${formData.price} USDC/hour` },
                        { trait_type: "Specialties", value: formData.specialties.join(', ') },
                        { trait_type: "Created", value: new Date().toISOString() }
                    ],
                    external_url: `walrus://blob/${blobId}`,
                    agentDataBlobId: blobId
                };

                // Store NFT metadata on Walrus
                const metadataBlobId = await walrusService.storeNFTMetadata(nftMetadata);

                // Store the agent blob ID in localStorage for the AgentsPage to use
                const currentBlobIds = JSON.parse(localStorage.getItem('agentBlobIds') || '[]');
                const updatedBlobIds = [...currentBlobIds, blobId];
                localStorage.setItem('agentBlobIds', JSON.stringify(updatedBlobIds));

                // Dispatch event to notify AgentsPage of new agent
                window.dispatchEvent(new CustomEvent('newAgentCreated', { 
                    detail: { blobId, metadataBlobId } 
                }));

                // TODO: Here you can integrate with your blockchain contracts
                // to mint NFTs using the metadataBlobId as the tokenURI
                
                alert('Agent published successfully!');
                
                navigate(ROUTES.AGENTS);
                
            } catch (error) {
                console.error('Error creating agent:', error);
                alert('Failed to publish agent. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.name.trim() && formData.category;
            case 2:
                return formData.avatar.trim();
            case 3:
                return formData.description.trim() && formData.description.length >= 50;
            case 4:
                return formData.price && parseFloat(formData.price) > 0;
            default:
                return false;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Basic Information';
            case 2:
                return 'Agent Avatar';
            case 3:
                return 'Detailed Description';
            case 4:
                return 'Price and Finalization';
            default:
                return '';
        }
    };

    return (
        <div className="create-agent-page">
            <HeaderPrivy />

            <div className="container">
                <div className="create-agent-content">
                    {/* Progress Bar */}
                    <div className="progress-bar">
                        <div className="progress-steps">
                            {[1, 2, 3, 4].map(step => (
                                <div 
                                    key={step} 
                                    className={`step ${step <= currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
                                >
                                    <div className="step-number">{step}</div>
                                    <div className="step-label">
                                        {step === 1 && 'Basic'}
                                        {step === 2 && 'Avatar'}
                                        {step === 3 && 'Description'}
                                        {step === 4 && 'Price'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="progress-line">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="form-content">
                        {/* Left Side - Form */}
                        <div className="form-section">
                            <h2>{getStepTitle()}</h2>

                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Agent Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Ex: Digital Marketing Assistant"
                                            maxLength="50"
                                        />
                                        <small>{formData.name.length}/50 characters</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Specialties</label>
                                        <input
                                            type="text"
                                            value={formData.specialties.join(', ')}
                                            onChange={(e) => handleInputChange('specialties', e.target.value.split(', '))}
                                            placeholder="Ex: SEO, Paid Campaigns, Analytics"
                                        />
                                        <small>Separate by commas</small>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Avatar */}
                            {currentStep === 2 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Agent Avatar *</label>
                                        <div className="avatar-options">
                                            <div className="emoji-grid">
                                                {['🤖', '👨‍💻', '👩‍💻', '📊', '📈', '💰', '🎨', '🔍', '💡', '🎯', '🚀', '⚡'].map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        className={`emoji-option ${formData.avatar === emoji ? 'selected' : ''}`}
                                                        onClick={() => handleInputChange('avatar', emoji)}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <small>Choose an emoji that represents your agent</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Or upload an image</label>
                                        <div className="upload-area">
                                            <input type="file" accept="image/*" />
                                            <p>Drag an image here or click to select</p>
                                            <small>Formats: JPG, PNG, GIF (max 2MB)</small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Description */}
                            {currentStep === 3 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Agent Description *</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Describe in detail what your agent does, its specialties and how it can help users..."
                                            rows="6"
                                            maxLength="500"
                                        />
                                        <small>
                                            {formData.description.length}/500 characters (minimum 50)
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label>Key Features</label>
                                        <textarea
                                            value={formData.keyFeatures}
                                            onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                                            placeholder="List the key features and capabilities of your agent..."
                                            rows="4"
                                            maxLength="300"
                                        />
                                        <small>{formData.keyFeatures.length}/300 characters</small>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Price */}
                            {currentStep === 4 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Price per Hour *</label>
                                        <div className="price-input">
                                            <span className="currency">USDC</span>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange('price', e.target.value)}
                                                placeholder="0.00"
                                                min="1"
                                                step="0.01"
                                            />
                                            <span className="unit">/hour</span>
                                        </div>
                                        <small>Set a fair price based on your agent's complexity</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Payment Wallet</label>
                                        {wallets.length > 0 ? (
                                            <div className="wallet-connected">
                                                <div className="wallet-status connected">
                                                    <span className="status-icon">✅</span>
                                                    <span className="wallet-address">
                                                        {wallets[0]?.address?.slice(0, 8)}...{wallets[0]?.address?.slice(-6)}
                                                    </span>
                                                </div>
                                                <small>Payments will be sent to this wallet address</small>
                                            </div>
                                        ) : (
                                            <div className="wallet-not-connected">
                                                <div className="wallet-status not-connected">
                                                    <span className="status-icon">⚠️</span>
                                                    <span>No wallet connected</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => connectWallet()}
                                                >
                                                    Connect Wallet for Payments
                                                </button>
                                                <small>Connect a wallet to receive payments for your agent</small>
                                            </div>
                                        )}
                                    </div>

                                    <div className="terms-section">
                                        <label className="checkbox-label">
                                            <input type="checkbox" />
                                            <span>I accept the service terms and platform policies</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="form-navigation">
                                {currentStep > 1 && (
                                    <button type="button" onClick={handlePrevStep} className="btn-secondary">
                                        Previous
                                    </button>
                                )}
                                {currentStep < 4 ? (
                                    <button 
                                        type="button" 
                                        onClick={handleNextStep} 
                                        className="btn-primary"
                                        disabled={!isStepValid()}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={handleSubmit} 
                                        className="btn-primary"
                                        disabled={!isStepValid() || isSubmitting}
                                    >
                                        {isSubmitting ? 'Publishing...' : 'Publish Agent'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Preview */}
                        <div className="preview-section">
                            <h3>Agent Preview</h3>
                            <div className="agent-card">
                                <div className="agent-card-header">
                                    <div className="agent-avatar">{formData.avatar || '🤖'}</div>
                                    <div className="agent-main-info">
                                        <h3 className="agent-name">
                                            {formData.name || 'Agent Name'}
                                            <span className="verified-badge">✓</span>
                                        </h3>
                                        <div className="agent-category">{formData.category || 'Category'}</div>
                                    </div>
                                </div>

                                <p className="agent-description">{formData.description || 'Agent description will appear here...'}</p>

                                <div className="agent-footer">
                                    <div className="agent-price">USDC {formData.price || '0'}/hour</div>
                                    <div className="agent-rating">
                                        ★★★★★ <span>5.0</span>
                                    </div>
                                </div>

                                <button className="btn-view-profile">View Agent</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateAgentPage; 