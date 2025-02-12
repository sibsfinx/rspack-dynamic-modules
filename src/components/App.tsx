import React, { Suspense, useState } from 'react';
import testImage from '../assets/test-image.png';
import '../styles/app.scss';

// Dynamic import of the component
const DynamicComponent = React.lazy(() => import('./DynamicComponent'));

const App: React.FC = () => {
    const [showDynamic, setShowDynamic] = useState(false);

    return (
        <div className="app-container">
            <h1>Rspack + React + TypeScript Test</h1>
            
            <section className="test-section">
                <h2>Image Loading Test</h2>
                <img src={testImage} alt="Test" className="test-image" />
            </section>

            <section className="test-section">
                <h2>Dynamic Import Test</h2>
                <button 
                    className="load-button"
                    onClick={() => setShowDynamic(prev => !prev)}
                >
                    {showDynamic ? 'Hide' : 'Load'} Dynamic Component
                </button>
                
                {showDynamic && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <DynamicComponent />
                    </Suspense>
                )}
            </section>

            <section className="test-section">
                <h2>Font Loading Test</h2>
                <p className="custom-font">This text should use a custom font!</p>
            </section>
        </div>
    );
};

export default App; 