import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Payment, PaymentDocument } from '../../entity/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
  ) {}

  async processPayment(orderData: { orderId: string; totalAmount: number }): Promise<Payment> {
    // Simulate payment processing
    const payment = new this.paymentModel({
      orderId: orderData.orderId,
      amount: orderData.totalAmount,
      status: 'completed', // Simulate success
    });
    const savedPayment = await payment.save();

    // Update order status
    this.orderClient.emit('payment_completed', { orderId: orderData.orderId, status: 'paid' });

    // Send notification
    this.notificationClient.emit('payment_success', { orderId: orderData.orderId });

    return savedPayment;
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async findOne(id: string): Promise<Payment | null> {
    return this.paymentModel.findById(id).exec();
  }
}