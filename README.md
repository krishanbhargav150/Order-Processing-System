# Order Processing System

A monolithic backend system with modular services for order processing with event-driven architecture.

## Architecture

**Monolithic Application with Modular Services:**
- **Users Module**: Authentication, profiles, rate limiting
- **Products Module**: Catalog with Redis caching
- **Orders Module**: Order management with inter-service communication
- **Payments Module**: Payment simulation
- **Notifications Module**: Email/SMS notification simulation

## Technologies

- **Framework**: NestJS
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **Cache**: Redis
- **Containerization**: Docker
- **Deployment**: AWS (planned)

## Event Flow

1. Order created emits `order_created` event
2. Payment module processes payment, emits `payment_completed`
3. Order status updated, product stock reduced
4. Notifications sent to user

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 18+

### Setup

1. Run `docker-compose up --build`
2. Application available on port 3000

### API Endpoints

#### Users
- `POST /users` - Create user
- `GET /users` - Get all users
- `POST /users/login` - Login (rate limited)

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

- Docker and Docker Compose
- Node.js 18+

### Setup

1. Clone the repository
2. Run `docker-compose up --build`
3. Services will be available on ports 3001-3005

### API Endpoints

#### User Service
- `POST /users` - Create user
- `GET /users` - Get all users
- `POST /users/login` - Login

#### Product Service
- `POST /products` - Create product
- `GET /products` - Get all products (cached)

#### Order Service
- `POST /orders` - Create order
- `GET /orders` - Get all orders

#### Payment Service
- `GET /payments` - Get all payments

#### Notification Service
- `GET /notifications` - Get all notifications

## Deployment

### AWS Setup

1. **EC2/ECS**: Host services in containers
2. **S3**: Store assets/logs
3. **DocumentDB**: MongoDB-compatible database
4. **ElastiCache**: Redis for caching
5. **Amazon MQ**: RabbitMQ message broker

### Infrastructure as Code

Use AWS CDK or CloudFormation to provision:

- VPC, subnets, security groups
- ECS cluster and services
- RDS/DocumentDB instance
- ElastiCache cluster
- MQ broker

### CI/CD

GitHub Actions workflow for automated deployment to ECS.

### Manual Deployment

1. Build Docker images
2. Push to ECR
3. Update ECS service

## Features

- Event-driven communication between services
- Product catalog caching with Redis
- Rate limiting (to be implemented)
- Docker containerization
- Microservices architecture