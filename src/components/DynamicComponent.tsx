import React from 'react';

const DynamicComponent: React.FC = () => {
    return (
        <div className="dynamic-component">
            <h2>This is a dynamically imported component!</h2>
            <p>If you see this, dynamic imports are working correctly.</p>
        </div>
    );
};

export default DynamicComponent; 