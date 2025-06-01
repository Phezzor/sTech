import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getActivities, 
  getRecentActivities, 
  getTodayActivities,
  getActivityStats,
  logActivity as logActivityUtil 
} from '../utils/activityLogger';

const ActivityContext = createContext();

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [todayActivities, setTodayActivities] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, byType: {} });
  const [unreadCount, setUnreadCount] = useState(0);

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, []);

  // Listen for activity events
  useEffect(() => {
    const handleActivityAdded = (event) => {
      loadActivities();
      setUnreadCount(prev => prev + 1);
    };

    const handleActivitiesCleared = () => {
      loadActivities();
      setUnreadCount(0);
    };

    window.addEventListener('activityAdded', handleActivityAdded);
    window.addEventListener('activitiesCleared', handleActivitiesCleared);

    return () => {
      window.removeEventListener('activityAdded', handleActivityAdded);
      window.removeEventListener('activitiesCleared', handleActivitiesCleared);
    };
  }, []);

  const loadActivities = () => {
    const allActivities = getActivities();
    const recent = getRecentActivities(10);
    const today = getTodayActivities();
    const statistics = getActivityStats();

    setActivities(allActivities);
    setRecentActivities(recent);
    setTodayActivities(today);
    setStats(statistics);
  };

  const logActivity = (type, data = {}, userId = null) => {
    const newActivity = logActivityUtil(type, data, userId);
    if (newActivity) {
      loadActivities();
      setUnreadCount(prev => prev + 1);
    }
    return newActivity;
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const refreshActivities = () => {
    loadActivities();
  };

  const value = {
    activities,
    recentActivities,
    todayActivities,
    stats,
    unreadCount,
    logActivity,
    markAsRead,
    refreshActivities,
    loadActivities
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};
