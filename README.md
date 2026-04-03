# Order Processing System

A backend system with modular NestJS services for order processing and event-driven architecture.

## Architecture

**Modular Services (in `nps/` and `notification-service/`)**:
- **Users**: Authentication, profiles, login
- **Products**: Inventory and Redis cache
- **Orders**: Order processing, event-driven workflow
- **Payments**: Payment simulation and status tracking
- **Notifications**: Notification delivery via events (email/SMS simulation)

## Technologies

- **Framework**: NestJS
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **Cache**: Redis
- **Containerization**: Docker
- **Deployment**: AWS (optional)

## Event Flow

1. `POST /orders` creates an order and emits `order_created`
2. Payments service handles payment and emits `payment_completed`
3. Orders service updates status and inventory
4. Notifications service sends user notifications

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 18+

### Setup

1. Clone repository
2. Run `docker-compose up --build`
3. Access API at `http://localhost:3000` (or ports 3001-3005 for split services)

### API Endpoints

#### Users
- `POST /users` - Create user
- `GET /users` - Get all users
- `POST /users/login` - Login

#### Products
- `POST /products` - Create product
- `GET /products` - Get all products (cached)

#### Orders
- `POST /orders` - Create order
- `GET /orders` - Get all orders

#### Payments
- `GET /payments` - Get all payments

#### Notifications
- `GET /notifications` - Get all notifications

## Cloud Service Links

- MongoDB: https://cloud.mongodb.com/v2/69ce58cf01b53ba210fda268#/overview?automateSecurity=true
- Redis: https://cloud.redis.io/#/databases
- RabbitMQ: https://api.cloudamqp.com/console/d1bd64d7-178a-49d8-a487-622ba6cb2fd9/details

## Deployment

### AWS (optional)

- EC2/ECS for services
- DocumentDB for MongoDB compatibility
- ElastiCache for Redis
- Amazon MQ for RabbitMQ

### CI/CD

- GitHub Actions (recommended)

## Features

- Event-driven communication
- Redis caching for product data
- Containerized in Docker
- Split services for scalable order processing