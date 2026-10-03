import { Response } from 'express';
import { mockDb } from '../mock/mockStore';
import { AuthRequest } from '../middleware/auth';
import { CalendarEventRecord } from '../types';

export class CalendarController {
  public static async getAll(req: AuthRequest, res: Response) {
    const eventType = req.query.eventType as string | undefined;

    let events = [...mockDb.calendarEvents];

    if (eventType && eventType !== 'ALL') {
      events = events.filter((e) => e.eventType === eventType);
    }

    return res.status(200).json({
      success: true,
      data: events,
      meta: {
        total: events.length,
      },
    });
  }

  public static async create(req: AuthRequest, res: Response) {
    const data = req.body;

    const newEvent: CalendarEventRecord = {
      id: mockDb.calendarEvents.length > 0 ? Math.max(...mockDb.calendarEvents.map((e) => e.id)) + 1 : 1,
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      driveId: data.driveId,
      departmentId: data.departmentId,
    };

    mockDb.calendarEvents.push(newEvent);
    mockDb.logAudit('CALENDAR_EVENT_CREATE', 'CalendarEvent', String(newEvent.id), newEvent, req.user);

    return res.status(201).json({
      success: true,
      message: 'Calendar event created successfully',
      data: newEvent,
    });
  }

  public static async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id as string, 10);
    const index = mockDb.calendarEvents.findIndex((e) => e.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const removed = mockDb.calendarEvents.splice(index, 1)[0];
    mockDb.logAudit('CALENDAR_EVENT_DELETE', 'CalendarEvent', String(id), removed, req.user);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  }
}
