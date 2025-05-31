import React from 'react';

// Spinner Loading Component
export const SpinnerLoading = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
    yellow: 'border-yellow-600'
  };

  return (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
  );
};

// Dots Loading Component
export const DotsLoading = ({ color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div className="flex space-x-2">
      <div className={`w-3 h-3 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-3 h-3 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`w-3 h-3 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

// Pulse Loading Component
export const PulseLoading = ({ color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div className="flex space-x-2">
      <div className={`w-4 h-4 ${colorClasses[color]} rounded-full animate-pulse`}></div>
      <div className={`w-4 h-4 ${colorClasses[color]} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`w-4 h-4 ${colorClasses[color]} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

// Wave Loading Component
export const WaveLoading = ({ color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div className="flex items-end space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-2 ${colorClasses[color]} rounded-t-sm animate-pulse`}
          style={{
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        ></div>
      ))}
    </div>
  );
};

// Full Page Loading Component
export const FullPageLoading = ({ message = 'Loading...', type = 'spinner' }) => {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <DotsLoading color="blue" />;
      case 'pulse':
        return <PulseLoading color="blue" />;
      case 'wave':
        return <WaveLoading color="blue" />;
      default:
        return <SpinnerLoading size="xl" color="blue" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 border border-blue-200">
        {renderLoader()}
        <p className="text-blue-800 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
};

// Card Loading Skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
};

// Table Loading Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(columns)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Button Loading Component
export const ButtonLoading = ({ children, loading = false, disabled = false, className = '', ...props }) => {
  return (
    <button
      className={`relative ${className} ${loading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SpinnerLoading size="sm" color="white" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// Page Transition Component
export const PageTransition = ({ children, isLoading = false }) => {
  return (
    <div className={`transition-all duration-500 ease-in-out ${
      isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
    }`}>
      {children}
    </div>
  );
};

// Loading Overlay Component
export const LoadingOverlay = ({ isVisible, message = 'Processing...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 border border-blue-200">
        <SpinnerLoading size="lg" color="blue" />
        <p className="text-blue-800 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
};

export default {
  SpinnerLoading,
  DotsLoading,
  PulseLoading,
  WaveLoading,
  FullPageLoading,
  CardSkeleton,
  TableSkeleton,
  ButtonLoading,
  PageTransition,
  LoadingOverlay
};
