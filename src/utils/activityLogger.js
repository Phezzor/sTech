// Activity Logger Utility
// Manages activity logs in localStorage for user actions

const ACTIVITY_STORAGE_KEY = 'stechno_activity_logs';
const MAX_ACTIVITIES = 50; // Keep only last 50 activities

export const ActivityTypes = {
  PRODUCT_ADDED: 'product_added',
  PRODUCT_UPDATED: 'product_updated',
  PRODUCT_DELETED: 'product_deleted',
  TRANSACTION_CREATED: 'transaction_created',
  TRANSACTION_UPDATED: 'transaction_updated',
  TRANSACTION_DELETED: 'transaction_deleted',
  SUPPLIER_ADDED: 'supplier_added',
  SUPPLIER_UPDATED: 'supplier_updated',
  SUPPLIER_DELETED: 'supplier_deleted',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  CATEGORY_ADDED: 'category_added'
};

export const ActivityMessages = {
  [ActivityTypes.PRODUCT_ADDED]: (data) => `Added product "${data.name}"`,
  [ActivityTypes.PRODUCT_UPDATED]: (data) => `Updated product "${data.name}"`,
  [ActivityTypes.PRODUCT_DELETED]: (data) => `Deleted product "${data.name}"`,
  [ActivityTypes.TRANSACTION_CREATED]: (data) => `Created ${data.type} transaction`,
  [ActivityTypes.TRANSACTION_UPDATED]: (data) => `Updated transaction ${data.id}`,
  [ActivityTypes.TRANSACTION_DELETED]: (data) => `Deleted transaction ${data.id}`,
  [ActivityTypes.SUPPLIER_ADDED]: (data) => `Added supplier "${data.name}"`,
  [ActivityTypes.SUPPLIER_UPDATED]: (data) => `Updated supplier "${data.name}"`,
  [ActivityTypes.SUPPLIER_DELETED]: (data) => `Deleted supplier "${data.name}"`,
  [ActivityTypes.USER_LOGIN]: (data) => `Logged in as ${data.username}`,
  [ActivityTypes.USER_LOGOUT]: (data) => `Logged out`,
  [ActivityTypes.CATEGORY_ADDED]: (data) => `Added category "${data.name}"`
};

export const ActivityIcons = {
  [ActivityTypes.PRODUCT_ADDED]: '📦',
  [ActivityTypes.PRODUCT_UPDATED]: '✏️',
  [ActivityTypes.PRODUCT_DELETED]: '🗑️',
  [ActivityTypes.TRANSACTION_CREATED]: '💰',
  [ActivityTypes.TRANSACTION_UPDATED]: '📝',
  [ActivityTypes.TRANSACTION_DELETED]: '❌',
  [ActivityTypes.SUPPLIER_ADDED]: '🏢',
  [ActivityTypes.SUPPLIER_UPDATED]: '🔄',
  [ActivityTypes.SUPPLIER_DELETED]: '🗑️',
  [ActivityTypes.USER_LOGIN]: '🔐',
  [ActivityTypes.USER_LOGOUT]: '👋',
  [ActivityTypes.CATEGORY_ADDED]: '📂'
};

// Get all activities from localStorage
export const getActivities = () => {
  try {
    const activities = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return activities ? JSON.parse(activities) : [];
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
};

// Add new activity
export const logActivity = (type, data = {}, userId = null) => {
  try {
    const activities = getActivities();
    
    const newActivity = {
      id: Date.now() + Math.random(),
      type,
      message: ActivityMessages[type] ? ActivityMessages[type](data) : 'Unknown activity',
      icon: ActivityIcons[type] || '📋',
      data,
      userId,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('id-ID'),
      time: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    // Add to beginning of array (newest first)
    activities.unshift(newActivity);

    // Keep only last MAX_ACTIVITIES
    const trimmedActivities = activities.slice(0, MAX_ACTIVITIES);

    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmedActivities));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('activityAdded', { 
      detail: newActivity 
    }));

    return newActivity;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

// Get recent activities (last N activities)
export const getRecentActivities = (limit = 10) => {
  const activities = getActivities();
  return activities.slice(0, limit);
};

// Get activities by type
export const getActivitiesByType = (type) => {
  const activities = getActivities();
  return activities.filter(activity => activity.type === type);
};

// Get activities by date
export const getActivitiesByDate = (date) => {
  const activities = getActivities();
  const targetDate = new Date(date).toLocaleDateString('id-ID');
  return activities.filter(activity => activity.date === targetDate);
};

// Get today's activities
export const getTodayActivities = () => {
  const today = new Date().toLocaleDateString('id-ID');
  return getActivitiesByDate(today);
};

// Clear all activities
export const clearActivities = () => {
  try {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('activitiesCleared'));
    return true;
  } catch (error) {
    console.error('Error clearing activities:', error);
    return false;
  }
};

// Get activity statistics
export const getActivityStats = () => {
  const activities = getActivities();
  const today = new Date().toLocaleDateString('id-ID');
  
  return {
    total: activities.length,
    today: activities.filter(a => a.date === today).length,
    byType: activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {})
  };
};

// Format relative time (e.g., "2 minutes ago")
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - activityTime) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};
