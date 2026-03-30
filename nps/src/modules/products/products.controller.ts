import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { Product } from '../../entity/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productsService.create(product);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() product: Partial<Product>): Promise<Product | null> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.delete(id);
  }

  @MessagePattern('get_product')
  async getProduct(id: string): Promise<Product | null> {
    return this.productsService.getProduct(id);
  }

  @MessagePattern('update_stock')
  async updateProductStock(data: { productId: string; quantity: number }): Promise<Product | null> {
    return this.productsService.updateProductStock(data);
  }
}