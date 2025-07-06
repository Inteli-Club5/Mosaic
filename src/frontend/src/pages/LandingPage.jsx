import React from 'react';
import { 
    Header, 
    Footer, 
    Hero, 
    ChatDemo, 
    HowItWorks, 
    NoCodeSection,
    AgentMonetization
} from '../components';

const LandingPage = () => {
    return (
        <div>
            <Header />
            
            <Hero 
                title="Connect with Specialized AI Agents"
                subtitle="Find the perfect agent for your needs or share your own agent with the community"
            />
            
            <HowItWorks />
            
            <ChatDemo />
            
            <NoCodeSection />
            
            <AgentMonetization />
            
            <Footer />
        </div>
    );
};

export default LandingPage; 