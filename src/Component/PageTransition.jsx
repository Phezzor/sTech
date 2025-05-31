import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    // Start transition when location changes
    setIsTransitioning(true);
    
    // Update children after fade out
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Transition overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 z-50 transition-all duration-300 ease-in-out ${
          isTransitioning 
            ? 'opacity-100 transform translate-x-0' 
            : 'opacity-0 transform translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-lg font-medium">Loading...</p>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isTransitioning 
            ? 'opacity-0 transform translate-y-4 scale-95' 
            : 'opacity-100 transform translate-y-0 scale-100'
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
};

// Slide transition
export const SlideTransition = ({ children, direction = 'right' }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  const getTransformClasses = () => {
    switch (direction) {
      case 'left':
        return isTransitioning ? '-translate-x-full' : 'translate-x-0';
      case 'right':
        return isTransitioning ? 'translate-x-full' : 'translate-x-0';
      case 'up':
        return isTransitioning ? '-translate-y-full' : 'translate-y-0';
      case 'down':
        return isTransitioning ? 'translate-y-full' : 'translate-y-0';
      default:
        return isTransitioning ? 'translate-x-full' : 'translate-x-0';
    }
  };

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className={`transition-transform duration-300 ease-in-out ${getTransformClasses()}`}
      >
        {displayChildren}
      </div>
    </div>
  );
};

// Fade transition
export const FadeTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full">
      <div 
        className={`transition-opacity duration-200 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
};

// Scale transition
export const ScaleTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full">
      <div 
        className={`transition-all duration-250 ease-in-out ${
          isTransitioning 
            ? 'opacity-0 transform scale-95' 
            : 'opacity-100 transform scale-100'
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
};

// Rotate transition
export const RotateTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full">
      <div 
        className={`transition-all duration-400 ease-in-out ${
          isTransitioning 
            ? 'opacity-0 transform rotate-12 scale-95' 
            : 'opacity-100 transform rotate-0 scale-100'
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
};

// Flip transition
export const FlipTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isTransitioning 
            ? 'opacity-0 transform rotateY-90' 
            : 'opacity-100 transform rotateY-0'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {displayChildren}
      </div>
    </div>
  );
};

export default PageTransition;
