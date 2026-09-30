import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<ToastNotification[]>([]);
  public readonly notifications = this.notificationsSignal.asReadonly();

  show(type: NotificationType, message: string, duration = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const notification: ToastNotification = { id, type, message, duration };
    
    this.notificationsSignal.update(list => [...list, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  success(message: string, duration = 4000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration = 5000): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 4000): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 4000): void {
    this.show('info', message, duration);
  }

  dismiss(id: string): void {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.notificationsSignal.set([]);
  }
}

