import React, { useState } from 'react';

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

    const categories = [
        'Análise de Dados',
        'Marketing',
        'Finanças',
        'Desenvolvimento',
        'Design',
        'Consultoria',
        'Educação',
        'Saúde',
        'Jurídico',
        'Outros'
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
        // Aqui seria feita a submissão do formulário
        console.log('Agente criado:', formData);
        alert('Agente criado com sucesso!');
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
                return 'Informações Básicas';
            case 2:
                return 'Avatar do Agente';
            case 3:
                return 'Descrição Detalhada';
            case 4:
                return 'Preço e Finalização';
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
                                <li><a href="/">Home</a></li>
                                <li><a href="/agents">Agentes</a></li>
                                <li><a href="/agents/create" className="active">Cadastrar Agente</a></li>
                            </ul>
                        </nav>
                        <div className="auth-buttons">
                            <button className="btn-login">Login</button>
                            <button className="btn-register">Cadastrar</button>
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
                                        {step === 1 && 'Básico'}
                                        {step === 2 && 'Avatar'}
                                        {step === 3 && 'Descrição'}
                                        {step === 4 && 'Preço'}
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
                                        <label>Nome do Agente *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Ex: Assistente de Marketing Digital"
                                            maxLength="50"
                                        />
                                        <small>{formData.name.length}/50 caracteres</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Categoria *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Especialidades</label>
                                        <input
                                            type="text"
                                            value={formData.specialties.join(', ')}
                                            onChange={(e) => handleInputChange('specialties', e.target.value.split(', '))}
                                            placeholder="Ex: SEO, Campanhas Pagas, Analytics"
                                        />
                                        <small>Separe por vírgulas</small>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Avatar */}
                            {currentStep === 2 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Avatar do Agente *</label>
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
                                        <small>Escolha um emoji que represente seu agente</small>
                                    </div>

                                    <div className="form-group">
                                        <label>Ou faça upload de uma imagem</label>
                                        <div className="upload-area">
                                            <input type="file" accept="image/*" />
                                            <p>Arraste uma imagem aqui ou clique para selecionar</p>
                                            <small>Formatos: JPG, PNG, GIF (máx. 2MB)</small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Description */}
                            {currentStep === 3 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Descrição do Agente *</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Descreva detalhadamente o que seu agente faz, suas especialidades e como pode ajudar os usuários..."
                                            rows="6"
                                            maxLength="500"
                                        />
                                        <small>
                                            {formData.description.length}/500 caracteres (mínimo 50)
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label>Experiência e Qualificações</label>
                                        <textarea
                                            value={formData.experience}
                                            onChange={(e) => handleInputChange('experience', e.target.value)}
                                            placeholder="Conte sobre sua experiência, certificações ou qualificações relevantes..."
                                            rows="4"
                                            maxLength="300"
                                        />
                                        <small>{formData.experience.length}/300 caracteres</small>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Price */}
                            {currentStep === 4 && (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label>Preço por Hora *</label>
                                        <div className="price-input">
                                            <span className="currency">R$</span>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange('price', e.target.value)}
                                                placeholder="0.00"
                                                min="1"
                                                step="0.01"
                                            />
                                            <span className="unit">/hora</span>
                                        </div>
                                        <small>Defina um preço justo baseado na complexidade do seu agente</small>
                                    </div>

                                    <div className="price-suggestions">
                                        <h4>Sugestões de preço por categoria:</h4>
                                        <ul>
                                            <li>Análise de Dados: R$ 40-80/hora</li>
                                            <li>Marketing: R$ 30-60/hora</li>
                                            <li>Desenvolvimento: R$ 50-100/hora</li>
                                            <li>Design: R$ 35-70/hora</li>
                                            <li>Consultoria: R$ 60-120/hora</li>
                                        </ul>
                                    </div>

                                    <div className="terms-section">
                                        <label className="checkbox-label">
                                            <input type="checkbox" />
                                            <span>Aceito os termos de serviço e políticas da plataforma</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="form-navigation">
                                {currentStep > 1 && (
                                    <button type="button" onClick={handlePrevStep} className="btn-secondary">
                                        Anterior
                                    </button>
                                )}
                                {currentStep < 4 ? (
                                    <button 
                                        type="button" 
                                        onClick={handleNextStep} 
                                        className="btn-primary"
                                        disabled={!isStepValid()}
                                    >
                                        Próximo
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={handleSubmit} 
                                        className="btn-primary"
                                        disabled={!isStepValid()}
                                    >
                                        Publicar Agente
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Preview */}
                        <div className="preview-section">
                            <h3>Preview do Agente</h3>
                            <div className="agent-card preview">
                                <div className="agent-avatar">
                                    {formData.avatar || '🤖'}
                                </div>
                                <div className="agent-info">
                                    <div className="agent-header">
                                        <h3>{formData.name || 'Nome do Agente'}</h3>
                                        <span className="verified-badge">✓</span>
                                    </div>
                                    <div className="agent-category">
                                        {formData.category || 'Categoria'}
                                    </div>
                                    <p className="agent-description">
                                        {formData.description || 'Descrição do agente aparecerá aqui...'}
                                    </p>
                                    <div className="agent-footer">
                                        <div className="agent-price">
                                            R${formData.price || '0'}/hora
                                        </div>
                                        <div className="agent-rating">
                                            ★★★★★ Novo
                                        </div>
                                    </div>
                                    <button className="btn-view-profile">Ver Perfil</button>
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