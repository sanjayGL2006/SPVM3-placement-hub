import { Request, Response } from 'express';
import { mockDb } from '../mock/mockStore';

export class NotificationController {
  public static async getAll(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      data: mockDb.notifications,
      meta: {
        unreadCount: mockDb.notifications.filter((n) => !n.isRead).length,
      },
    });
  }

  public static async markAsRead(req: Request, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const notification = mockDb.notifications.find((n) => n.id === id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.isRead = true;

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  }

  public static async markAllAsRead(req: Request, res: Response) {
    mockDb.notifications.forEach((n) => {
      n.isRead = true;
    });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  }
}
