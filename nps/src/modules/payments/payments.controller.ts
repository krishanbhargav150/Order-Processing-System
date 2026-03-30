import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';
import { Payment } from '../../entity/payment.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() paymentData: { orderId: string; amount: number }): Promise<Payment> {
    return this.paymentsService.processPayment({ orderId: paymentData.orderId, totalAmount: paymentData.amount });
  }

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Payment | null> {
    return this.paymentsService.findOne(id);
  }

  @EventPattern('order_created')
  async handleOrderCreated(data: { orderId: string; totalAmount: number }) {
    await this.paymentsService.processPayment(data);
  }
}