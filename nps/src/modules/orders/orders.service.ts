import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderDocument } from '../../entity/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
  ) {}

  async create(orderData: { userId: string; items: { productId: string; quantity: number }[] }): Promise<Order> {
    // Calculate total and validate products
    let total = 0;
    const itemsWithPrice: { productId: string; quantity: number; price: number }[] = [];

    for (const item of orderData.items) {
      // Get product details (in real app, call product service)
      const product = await this.productClient.send('get_product', item.productId).toPromise();
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      itemsWithPrice.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
      total += product.price * item.quantity;
    }

    const order = new this.orderModel({
      ...orderData,
      items: itemsWithPrice,
      totalAmount: total,
    });
    const savedOrder = await order.save();

    // Publish order created event
    this.paymentClient.emit('order_created', { orderId: savedOrder._id, totalAmount: total });

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async updateStatus(id: string, status: string): Promise<Order | null> {
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (order && status === 'paid') {
      // Update product stock
      for (const item of order.items) {
        this.productClient.emit('update_stock', { productId: item.productId, quantity: item.quantity });
      }
      // Send notification
      this.notificationClient.emit('order_paid', { orderId: id, userId: order.userId });
    }
    return order;
  }
}