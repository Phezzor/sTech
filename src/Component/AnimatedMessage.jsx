import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const AnimatedMessage = ({ type, message, isVisible, onClose, duration = 5000 }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto close after duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  const getMessageConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: FaCheckCircle,
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
          borderColor: 'border-green-400',
          textColor: 'text-white',
          iconColor: 'text-green-100'
        };
      case 'error':
        return {
          icon: FaExclamationTriangle,
          bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
          borderColor: 'border-red-400',
          textColor: 'text-white',
          iconColor: 'text-red-100'
        };
      case 'info':
        return {
          icon: FaInfoCircle,
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          borderColor: 'border-blue-400',
          textColor: 'text-white',
          iconColor: 'text-blue-100'
        };
      default:
        return {
          icon: FaInfoCircle,
          bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
          borderColor: 'border-gray-400',
          textColor: 'text-white',
          iconColor: 'text-gray-100'
        };
    }
  };

  const config = getMessageConfig();
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          border rounded-2xl shadow-2xl p-4 min-w-80 max-w-md
          transform transition-all duration-300 ease-in-out
          ${isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
      >
        <div className="flex items-start gap-3">
          {/* Animated Icon */}
          <div className={`
            ${config.iconColor} 
            transform transition-all duration-500 ease-in-out
            ${isAnimating ? 'rotate-0 scale-100' : 'rotate-180 scale-0'}
          `}>
            <Icon size={24} />
          </div>

          {/* Message Content */}
          <div className="flex-1">
            <p className="font-medium text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              ${config.iconColor} hover:text-white
              p-1 rounded-lg hover:bg-white/20 
              transition-all duration-200 ease-in-out
              transform hover:scale-110
            `}
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`
              h-full bg-white/40 rounded-full
              transform transition-all ease-linear
              ${isAnimating ? 'translate-x-0' : '-translate-x-full'}
            `}
            style={{
              transitionDuration: `${duration}ms`,
              width: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Hook for using animated messages
export const useAnimatedMessage = () => {
  const [messages, setMessages] = useState([]);

  const showMessage = (type, message, duration = 5000) => {
    const id = Date.now();
    const newMessage = { id, type, message, duration };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const showSuccess = (message, duration) => showMessage('success', message, duration);
  const showError = (message, duration) => showMessage('error', message, duration);
  const showInfo = (message, duration) => showMessage('info', message, duration);

  const MessageContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((msg) => (
        <AnimatedMessage
          key={msg.id}
          type={msg.type}
          message={msg.message}
          isVisible={true}
          duration={msg.duration}
          onClose={() => removeMessage(msg.id)}
        />
      ))}
    </div>
  );

  return {
    showSuccess,
    showError,
    showInfo,
    MessageContainer
  };
};

export default AnimatedMessage;
