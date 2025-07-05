import React from 'react';
import { Header, Footer, Hero, ChatDemo, FeaturesSection } from '../components';

const LandingPage = () => {
    return (
        <div>
            <Header />
            
            <Hero 
                title="Conecte-se com Agentes de IA Especializados"
                subtitle="Encontre o agente perfeito para suas necessidades ou compartilhe seu próprio agente com a comunidade"
            />
            
            <ChatDemo />
            
            <FeaturesSection />
            
            <Footer />
        </div>
    );
};

export default LandingPage; 