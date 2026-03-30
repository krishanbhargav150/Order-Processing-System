import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { Notification } from './notification.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() notificationData: { userId: string; message: string; type?: string }): Promise<Notification> {
    return this.notificationService.sendNotification(
      notificationData.userId,
      notificationData.message,
      notificationData.type,
    );
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findOne(id);
  }

  @EventPattern('order_paid')
  async handleOrderPaid(data: { orderId: string; userId: string }) {
    await this.notificationService.sendNotification(
      data.userId,
      `Your order ${data.orderId} has been paid and is being processed.`,
    );
  }

  @EventPattern('payment_success')
  async handlePaymentSuccess(data: { orderId: string }) {
    // In real app, get userId from order service
    await this.notificationService.sendNotification(
      'user123', // placeholder
      `Payment for order ${data.orderId} was successful.`,
    );
  }
}