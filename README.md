# FoodRush - Online Food Delivery App

Full-stack food delivery application built with Spring Boot + React.

## Tech Stack
- **Backend**: Java 8, Spring Boot 3.2, Spring Security (JWT), JPA/Hibernate
- **Database**: MySQL 8
- **Frontend**: React 18, React Router v6, Axios, Vite

## Project Structure
```
food-delivery/
├── backend/          Spring Boot REST API
├── frontend/         React SPA
└── database/         SQL schema
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/restaurants | Public | List open restaurants |
| GET | /api/restaurants/{id} | Public | Restaurant details |
| GET | /api/restaurants/search?q= | Public | Search restaurants |
| GET | /api/food-items/restaurant/{id} | Public | Menu items |
| GET | /api/cart | User | Get cart |
| POST | /api/cart/add | User | Add to cart |
| PUT | /api/cart/item/{id}?quantity= | User | Update quantity |
| DELETE | /api/cart/item/{id} | User | Remove item |
| POST | /api/orders/place | User | Place order |
| GET | /api/orders/my-orders | User | Order history |
| GET | /api/orders/{id} | User | Order detail |
| GET | /api/admin/restaurants | Admin | All restaurants |
| POST | /api/admin/restaurants | Admin | Create restaurant |
| PUT | /api/admin/restaurants/{id} | Admin | Update restaurant |
| DELETE | /api/admin/restaurants/{id} | Admin | Delete restaurant |
| POST | /api/admin/restaurants/{id}/food-items | Admin | Add food item |
| PUT | /api/admin/food-items/{id} | Admin | Update food item |
| DELETE | /api/admin/food-items/{id} | Admin | Delete food item |
| GET | /api/admin/orders | Admin | All orders |
| PUT | /api/admin/orders/{id}/status?status= | Admin | Update order status |
| GET | /api/admin/users | Admin | All users |
| DELETE | /api/admin/users/{id} | Admin | Delete user |

## Setup & Run

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

### Database
```sql
CREATE DATABASE food_delivery_db;
-- Tables are auto-created by Hibernate on first run
-- Or run: database/schema.sql
```

Update `backend/src/main/resources/application.properties` with your MySQL credentials.

### Backend
```bash
cd food-delivery/backend
mvn spring-boot:run
# Runs on http://localhost:8080
# Sample data is auto-seeded on first run
```

### Frontend
```bash
cd food-delivery/frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Demo Credentials
- **Admin**: admin@fooddelivery.com / admin123
- **User**: john@example.com / password123

## Features
- User registration & JWT authentication
- Browse restaurants with search & filter
- View menus by category
- Add to cart, update quantities
- Place orders with delivery address
- Order tracking with status steps
- Order history
- Admin dashboard with stats
- Admin: manage restaurants, menus, orders, users
