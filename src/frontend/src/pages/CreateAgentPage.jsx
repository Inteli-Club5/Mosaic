import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const CreateAgentPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        avatar: '',
        description: '',
        price: '',
        specialties: [],
        experience: ''
    });
    const navigate = useNavigate();

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

    const handleSubmit = () => {
        if (isStepValid()) {
            // Here would be the API call to create the agent
            console.log('Publishing agent:', formData);
            
            // Redirect to agents page after successful submission
            alert('Agent published successfully!');
            navigate(ROUTES.AGENTS);
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
            {/* Header */}
            <header>
                <div className="container">
                    <div className="nav-wrapper">
                        <div className="logo">
                            <img src="./logo.png" alt="Mosaic Logo" />
                        </div>
                        <nav>
                            <ul>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(ROUTES.HOME); }}>Home</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(ROUTES.AGENTS); }}>Agents</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate(ROUTES.CREATE_AGENT); }} className="active">Register Agent</a></li>
                            </ul>
                        </nav>
                        <div className="auth-buttons">
                            <button className="btn-login">Login</button>
                            <button className="btn-register">Register</button>
                        </div>
                    </div>
                </div>
            </header>

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
                                        <label>Experience and Qualifications</label>
                                        <textarea
                                            value={formData.experience}
                                            onChange={(e) => handleInputChange('experience', e.target.value)}
                                            placeholder="Tell about your experience, certifications or relevant qualifications..."
                                            rows="4"
                                            maxLength="300"
                                        />
                                        <small>{formData.experience.length}/300 characters</small>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Price */}
                            {currentStep === 4 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Price per Hour *</label>
                                        <div className="price-input">
                                            <span className="currency">$</span>
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

                                    <div className="price-suggestions">
                                        <h4>Price suggestions by category:</h4>
                                        <ul>
                                            <li>Data Analysis: $40-80/hour</li>
                                            <li>Marketing: $30-60/hour</li>
                                            <li>Development: $50-100/hour</li>
                                            <li>Design: $35-70/hour</li>
                                            <li>Consulting: $60-120/hour</li>
                                        </ul>
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
                                        disabled={!isStepValid()}
                                    >
                                        Publish Agent
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Preview */}
                        <div className="preview-section">
                            <h3>Agent Preview</h3>
                            <div className="agent-card preview">
                                <div className="agent-avatar">
                                    {formData.avatar || '🤖'}
                                </div>
                                <div className="agent-info">
                                    <div className="agent-header">
                                        <h3>{formData.name || 'Agent Name'}</h3>
                                        <span className="verified-badge">✓</span>
                                    </div>
                                    <div className="agent-category">
                                        {formData.category || 'Category'}
                                    </div>
                                    <p className="agent-description">
                                        {formData.description || 'Agent description will appear here...'}
                                    </p>
                                    <div className="agent-footer">
                                        <div className="agent-price">
                                            ${formData.price || '0'}/hour
                                        </div>
                                        <div className="agent-rating">
                                            ★★★★★ New
                                        </div>
                                    </div>
                                    <button className="btn-view-profile">View Profile</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAgentPage; 