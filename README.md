# 📦 E-Commerce Backend (NestJS + TypeORM + PostgreSQL)

A scalable **e-commerce backend** built with **NestJS**, **TypeORM**,
**PostgreSQL**, and **Redis**.\
This project includes authentication, product management, cart, orders,
payments, blog system, galleries, background tasks, and more.

## 🚀 Features

- 🔐 Authentication (JWT, OTP, Roles)
- 👤 User management
- 🛒 Cart system
- 📦 Order management
- 💳 Payment integration
- 🧺 Product CRUD + Gallery
- 📰 Blog module
- 🧠 Redis caching & OTP
- 🕒 Background tasks
- 📚 DTO validation
- 🎯 Modular architecture

## 🧱 Tech Stack

Technology Purpose

---

NestJS Backend framework
TypeORM ORM
PostgreSQL Database
Redis OTP & Cache
JWT Authentication
Multer File Upload
TypeScript Type safety

## 📁 Folder Structure

    src
    ├── auth
    ├── blog
    ├── cart
    ├── common
    ├── gallery
    ├── lib
    ├── order
    ├── otp
    ├── payment
    ├── product
    ├── redis
    ├── tasks
    ├── user
    ├── main.ts
    ├── app.module.ts

## 🛠 Installation

```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

## ⚙️ Environment Variables

    PORT=3000
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=postgres
    DATABASE_PASS=yourpassword
    DATABASE_NAME=ecommerce

    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d

    REDIS_HOST=localhost
    REDIS_PORT=6379

    PAYMENT_API_KEY=your_key
    PAYMENT_CALLBACK_URL=https://yourdomain.com/payment/callback

## ▶️ Running the App

```sh
npm run start:dev
npm run start:prod
```

## 📡 Scripts

- npm start
- npm run start:dev
- npm run build
- npm test
- npm run lint

## 📦 Module Overview

### Auth

- JWT login, OTP, Roles

### User

- CRUD user, profiles

### Product

- Product CRUD + Gallery

### Cart

- Add/remove items

### Order

- Create orders
- Order items
- Delivery & payment methods

### Payment

- Session creation

### Blog

- CRUD blog posts

### Redis

- OTP & cache

### Tasks

- Cron jobs

## 🤝 Contributing

1.  Fork the repo
2.  Create a branch
3.  Commit changes
4.  Open PR

## 📄 License

MIT License
