import React from 'react';
import './LoadingSpinner.css'; // Make sure to create this CSS file

const LoadingSpinner = ({ size = 'medium', color = '#4CAF50' }) => {
    // Define CSS variables for customization
    const spinnerStyle = {
        '--spinner-size': 
            size === 'small' ? '20px' : 
            size === 'large' ? '60px' : '40px',
        '--spinner-border-width': 
            size === 'small' ? '3px' : '4px',
        '--spinner-color': color,
    };

    return (
        <div className="spinner-container">
            <div 
                className="loading-spinner" 
                style={spinnerStyle} 
                role="status" 
                aria-live="polite" 
                aria-label="Loading"
            >
                {/* Visual spinner element is created purely by CSS */}
            </div>
            {/* Optional text for better accessibility and user clarity */}
            <p className="spinner-text">Loading...</p> 
        </div>
    );
};

export default LoadingSpinner;