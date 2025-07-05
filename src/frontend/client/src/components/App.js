import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';

class App extends Component {
    render() {
        return (
            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                </Routes>
            </div>
        );
    }
}

export default App;