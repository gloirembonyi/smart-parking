import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.configureNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private configureNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async scheduleExpirationReminder(parkingId: string, expirationTime: Date) {
    const trigger = expirationTime.getTime() - Date.now() - 15 * 60 * 1000; // 15 minutes before expiration
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Parking Expiring Soon',
        body: 'Your parking session will expire in 15 minutes. Need more time?',
        data: { parkingId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.floor(trigger / 1000)),
      },
    });
  }

  async sendAvailabilityAlert(spotName: string, address: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Parking Spot Available',
        body: `A spot is now available at ${spotName} (${address})`,
        data: { type: 'availability' },
      },
      trigger: null, // Send immediately
    });
  }

  async sendPaymentConfirmation(amount: number, spotName: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Payment Confirmed',
        body: `Payment of $${amount} for ${spotName} was successful`,
        data: { type: 'payment' },
      },
      trigger: null,
    });
  }

  async sendReservationReminder(spotName: string, startTime: Date) {
    const trigger = startTime.getTime() - Date.now() - 30 * 60 * 1000; // 30 minutes before start
    
    if (trigger > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Upcoming Parking Reservation',
          body: `Your parking reservation at ${spotName} starts in 30 minutes`,
          data: { type: 'reservation' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.floor(trigger / 1000),
        },
      });
    }
  }

  async cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default NotificationService.getInstance(); 