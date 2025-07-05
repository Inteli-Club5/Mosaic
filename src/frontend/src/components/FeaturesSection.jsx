import React from 'react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Busca Inteligente',
      description: 'Encontre agentes especializados usando nossa busca avançada por categoria, preço e avaliações'
    },
    {
      icon: '💎',
      title: 'Agentes Verificados',
      description: 'Todos os agentes passam por processo de verificação para garantir qualidade e confiabilidade'
    },
    {
      icon: '🚀',
      title: 'Acesso Instantâneo',
      description: 'Conecte-se instantaneamente com agentes através de nossa plataforma integrada'
    },
    {
      icon: '🔒',
      title: 'Pagamento Seguro',
      description: 'Transações seguras com blockchain e contratos inteligentes'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Acompanhe métricas e desempenho dos seus agentes em tempo real'
    },
    {
      icon: '🎯',
      title: 'Personalização',
      description: 'Agentes adaptáveis às suas necessidades específicas e preferências'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2>Principais Funcionalidades</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 