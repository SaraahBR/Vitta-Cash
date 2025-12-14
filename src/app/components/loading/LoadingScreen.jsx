'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import './loadingScreen.css';

export default function LoadingScreen({ message = 'Carregando...' }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <Image 
            src="/LOGO_VittaCash.png" 
            alt="VittaCash" 
            width={120} 
            height={120}
            className="loading-logo-img"
          />
        </div>
        
        <h2 className="loading-title">{message}</h2>
        
        <div className="loading-bar-container">
          <div 
            className="loading-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="loading-percentage">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

LoadingScreen.propTypes = {
  message: PropTypes.string,
};
