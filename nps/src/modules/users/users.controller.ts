import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { User } from '../../entity/user.schema';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() user: Partial<User>): Promise<User | null> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User | null> {
    return this.usersService.delete(id);
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }): Promise<User | null> {
    return this.usersService.validatePassword(credentials.email, credentials.password);
  }
}