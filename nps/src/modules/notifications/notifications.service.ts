import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../../entity/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async sendNotification(userId: string, message: string, type: string = 'email'): Promise<Notification> {
    // Simulate sending notification
    console.log(`Sending ${type} to user ${userId}: ${message}`);

    const notification = new this.notificationModel({
      userId,
      message,
      type,
    });
    return notification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
  }
}