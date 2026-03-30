import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Product, ProductDocument } from '../../entity/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(product: Partial<Product>): Promise<Product> {
    const createdProduct = new this.productModel(product);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const cachedProducts = await this.cacheManager.get<Product[]>('products');
    if (cachedProducts) {
      return cachedProducts;
    }
    const products = await this.productModel.find().exec();
    await this.cacheManager.set('products', products, 300000); // 5 minutes
    return products;
  }

  async findOne(id: string): Promise<Product | null> {
    const cacheKey = `product_${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
    if (cachedProduct) {
      return cachedProduct;
    }
    const product = await this.productModel.findById(id).exec();
    if (product) {
      await this.cacheManager.set(cacheKey, product, 300000);
    }
    return product;
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
    // Invalidate cache
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products');
    return updatedProduct;
  }

  async delete(id: string): Promise<Product | null> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    // Invalidate cache
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products');
    return deletedProduct;
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true },
    ).exec();
    // Invalidate cache
    await this.cacheManager.del(`product_${id}`);
    await this.cacheManager.del('products');
    return updatedProduct;
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.findOne(id);
  }

  async updateProductStock(data: { productId: string; quantity: number }): Promise<Product | null> {
    return this.updateStock(data.productId, data.quantity);
  }
}