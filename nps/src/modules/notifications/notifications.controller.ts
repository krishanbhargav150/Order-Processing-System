import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../entity/notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() notificationData: { userId: string; message: string; type?: string }): Promise<Notification> {
    return this.notificationsService.sendNotification(
      notificationData.userId,
      notificationData.message,
      notificationData.type,
    );
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notification | null> {
    return this.notificationsService.findOne(id);
  }

  @EventPattern('order_paid')
  async handleOrderPaid(data: { orderId: string; userId: string }) {
    await this.notificationsService.sendNotification(
      data.userId,
      `Your order ${data.orderId} has been paid and is being processed.`,
    );
  }

  @EventPattern('payment_success')
  async handlePaymentSuccess(data: { orderId: string }) {
    // In real app, get userId from order service
    await this.notificationsService.sendNotification(
      'user123', // placeholder
      `Payment for order ${data.orderId} was successful.`,
    );
  }
}