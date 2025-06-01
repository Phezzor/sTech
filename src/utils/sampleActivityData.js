// Sample Activity Data for Testing
import { logActivity, ActivityTypes } from './activityLogger';

export const generateSampleActivities = () => {
  const sampleActivities = [
    {
      type: ActivityTypes.USER_LOGIN,
      data: { username: 'admin', email: 'admin@mail.com' },
      userId: 'user1'
    },
    {
      type: ActivityTypes.PRODUCT_ADDED,
      data: { name: 'Laptop Gaming ASUS', id: 'PRD001', code: 'LAP-001' },
      userId: 'user1'
    },
    {
      type: ActivityTypes.CATEGORY_ADDED,
      data: { name: 'Electronics', id: 'CAT001' },
      userId: 'user1'
    },
    {
      type: ActivityTypes.SUPPLIER_ADDED,
      data: { name: 'PT Maju Jaya', id: 'SUP001' },
      userId: 'user1'
    },
    {
      type: ActivityTypes.TRANSACTION_CREATED,
      data: { type: 'IN', id: 'TRX001' },
      userId: 'user1'
    },
    {
      type: ActivityTypes.PRODUCT_UPDATED,
      data: { name: 'Baju PDH HIMATIF', id: 'PRD002' },
      userId: 'user1'
    }
  ];

  // Add activities with some time delay between them
  sampleActivities.forEach((activity, index) => {
    setTimeout(() => {
      logActivity(activity.type, activity.data, activity.userId);
    }, index * 100); // 100ms delay between each activity
  });

  console.log('Sample activities generated!');
};

// Function to clear all activities (for testing)
export const clearAllActivities = () => {
  localStorage.removeItem('stechno_activity_logs');
  window.dispatchEvent(new CustomEvent('activitiesCleared'));
  console.log('All activities cleared!');
};
