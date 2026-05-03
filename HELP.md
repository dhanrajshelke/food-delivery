# Software Setup Help File

## Project: FoodRush - Food Delivery Application

---

## Project Overview

FoodRush is a full-stack food delivery web application that allows users to browse restaurants,
explore menus, add items to a cart, and place orders with real-time tracking. It is built using
React.js on the frontend and Java Spring Boot on the backend, with MySQL as the database.

The primary goal of this project is to simulate a real-world food delivery platform while
demonstrating modern full-stack development practices including REST API design, JWT
authentication, role-based access control, and real-time order status updates using
Server-Sent Events (SSE).

---

## Key Features

Based on the application interface, the project includes the following core functionalities:

- **Restaurant Browsing:** A home page with popular restaurants, cuisine filters, and a
  search bar to find restaurants by name or cuisine type.

- **Menu & Cart System:** Users can browse a restaurant's menu, add food items to their
  cart, adjust quantities, and remove items before placing an order.

- **Order Placement:** Users can place orders by providing a delivery address and selecting
  a payment method (Cash on Delivery, Online, or Card).

- **Real-Time Order Tracking:** Order status updates are pushed to the user in real time
  using Server-Sent Events (SSE) — from PENDING to DELIVERED.

- **JWT Authentication:** Secure login and registration system using JSON Web Tokens.
  Sessions are stateless and token-based.

- **Role-Based Access:** Two roles exist — USER and ADMIN. Admin users have access to
  a dedicated dashboard to manage the platform.

- **Admin Dashboard:** Admins can manage restaurants, food items, orders, and users
  from a single panel.

- **AI Chat Assistant:** A floating chat button on every page for user assistance.

---

## Technical Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React.js 18, Vite, React Router v6      |
| Styling    | CSS (custom, component-scoped)          |
| Backend    | Java 8, Spring Boot 2.7, Maven          |
| Database   | MySQL 8                                 |
| Auth       | JWT (JSON Web Token) + Spring Security  |
| Real-Time  | Server-Sent Events (SSE)                |
| HTTP Client| Axios                                   |
| Tools      | Node.js, npm, IntelliJ / VS Code        |

---

## Prerequisites

Before you begin, ensure you have the following installed on your computer:

- **Java JDK 8** — Download from https://www.oracle.com/java/technologies/downloads/#java8-windows
- **Maven** — Download from https://maven.apache.org/download.cgi
- **Node.js & npm** — Download from https://nodejs.org (LTS version recommended)
- **MySQL 8** — Download from https://dev.mysql.com/downloads/installer
- **Code Editor** — Visual Studio Code (recommended) or any editor of your choice

Verify all installations by running in your terminal:

```cmd
java -version
mvn -version
node -v
npm -v
mysql --version
```

---

## Local Setup & Installation Guide

To run this project locally on your machine, follow these step-by-step instructions.

### Step 1: Extract the Project

Extract the project zip file to your desired folder. The project root will be:

```
C:\Users\DHANRAJ\Desktop\Project\1.food-delivery\
```

### Step 2: Setup MySQL Database

Open MySQL Workbench or MySQL command line and run:

```sql
CREATE DATABASE food_delivery_db;
```

The application will automatically create all tables on first run using Spring Boot's
`spring.jpa.hibernate.ddl-auto=update` setting.

If your MySQL password is different, update it in:

```
backend/src/main/resources/application.properties
```

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### Step 3: Run the Backend

Open a terminal (CMD), navigate to the backend folder, and run:

```cmd
cd C:\Users\DHANRAJ\Desktop\Project\1.food-delivery\backend
set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_481
mvn clean spring-boot:run
```

Wait until you see the following message in the terminal:

```
Started FoodDeliveryApplication on port 8081
```

### Step 4: Install Frontend Dependencies

Open a second terminal, navigate to the frontend folder, and install packages:

```cmd
cd C:\Users\DHANRAJ\Desktop\Project\1.food-delivery\frontend
npm install
```

### Step 5: Run the Frontend

Once installation is complete, start the development server:

```cmd
npm run dev
```

This will start the frontend at:

```
http://localhost:3000
```

Open this URL in your browser to use the application.

---

## Default Login Credentials

| Role  | Email                     | Password   |
|-------|---------------------------|------------|
| Admin | dhanrajshelke11@gmail.com | dhanraj@98 |
| User  | parththube11@gmail.com    | Parth@9423 |

---

## Project Structure

A standard full-stack architecture for this implementation looks like this:

```
1.food-delivery/
│
├── backend/                          → Spring Boot REST API (Port 8081)
│   └── src/main/java/com/fooddelivery/
│       ├── controller/               → API endpoint handlers
│       ├── service/                  → Business logic layer
│       ├── model/                    → JPA database entities
│       ├── repository/               → Spring Data JPA repositories
│       ├── security/                 → JWT filter and utilities
│       ├── dto/                      → Request/Response data objects
│       └── config/                   → Security, CORS, data seeding
│
├── frontend/                         → React Application (Port 3000)
│   └── src/
│       ├── pages/                    → Full page components (Home, Cart, Orders, Admin)
│       ├── components/               → Reusable UI parts (Navbar, Footer, Cards)
│       ├── context/                  → Global state (AuthContext, CartContext)
│       ├── api/                      → Axios HTTP client configuration
│       └── App.jsx                   → Main routing configuration
│
└── database/
    └── schema.sql                    → Database schema reference
```

---

## How to Use the Application

### For Customers

1. **Register** — Click Sign Up, fill in your details, and create an account.
2. **Login** — Sign in with your email and password.
3. **Browse** — Search for restaurants or filter by cuisine on the home page.
4. **Order** — Open a restaurant, add items to cart, enter your address, and place the order.
5. **Track** — Go to My Orders to see live status updates of your order.

### For Admins

1. Login with admin credentials.
2. Navigate to `http://localhost:3000/admin`.
3. Use the dashboard to manage restaurants, food items, orders, and users.
4. Update order statuses — customers receive updates in real time.

---

## Ports Reference

| Service  | Port |
|----------|------|
| Backend  | 8081 |
| Frontend | 3000 |
| MySQL    | 3306 |

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Port already in use | Another process on port 8081 | Run `taskkill /PID <pid> /F` as Administrator |
| No compiler error | JRE installed instead of JDK | Install JDK 8 and set JAVA_HOME |
| Cannot connect to MySQL | MySQL service not running | Start MySQL from Services or MySQL Workbench |
| White screen on frontend | Backend not running | Ensure backend started successfully on port 8081 |
| Login not working | Wrong credentials or DB not seeded | Verify MySQL is running and backend started fully |

---

## Detailed Operations Guide

### How to Add a Restaurant (Admin)

1. Login with admin credentials
2. Go to `http://localhost:3000/admin/restaurants`
3. Click the **Add Restaurant** button
4. Fill in the following details:
   - Restaurant Name
   - Cuisine Type (e.g. North Indian, Biryani)
   - Address
   - Image URL
   - Opening Hours
5. Click **Save** — the restaurant will appear in the list immediately

---

### How to Delete a Restaurant (Admin)

1. Go to `http://localhost:3000/admin/restaurants`
2. Find the restaurant you want to remove
3. Click the **Delete** button next to it
4. Confirm the deletion
5. The restaurant and all its food items will be removed

---

### How to Add a Food Item to a Restaurant (Admin)

1. Go to `http://localhost:3000/admin/restaurants`
2. Click on the restaurant you want to add food items to
3. Click **Add Food Item**
4. Fill in:
   - Item Name
   - Description
   - Price (in ₹)
   - Image URL
   - Available (Yes / No)
5. Click **Save** — the item will appear on the restaurant's menu

---

### How to Delete a Food Item (Admin)

1. Go to the restaurant's food items page
2. Find the food item you want to remove
3. Click the **Delete** button next to it
4. The item will be removed from the menu immediately

---

### How to Manage an Order / Update Delivery Status (Admin)

1. Go to `http://localhost:3000/admin/orders`
2. You will see all orders from all users
3. Find the order you want to update
4. Use the **Status dropdown** next to the order to change its status:

```
PENDING → CONFIRMED → PREPARING → OUT FOR DELIVERY → DELIVERED
```

5. Click **Update** — the customer will see the new status in real time on their order tracking page
6. To cancel an order, select **CANCELLED** from the dropdown

---

### How to View / Delete a User (Admin)

1. Go to `http://localhost:3000/admin/users`
2. You will see a list of all registered users with their:
   - Name
   - Email
   - Phone Number
   - Address
   - Role (USER / ADMIN)
3. To delete a user, click the **Delete** button next to their name

---

### How to Place an Order (Customer)

1. Login to your account
2. Go to any restaurant and click on food items to add them to cart
3. Click the 🛒 cart icon in the navbar
4. Review your items — use **+** / **−** to adjust quantities
5. Enter your **Delivery Address** in the text box
6. Select your **Payment Method**:
   - Cash on Delivery
   - Online Payment
   - Credit/Debit Card
7. Click **Place Order**
8. You will be redirected to the order tracking page automatically

---

### How to Cancel or Track an Order (Customer)

1. Click **My Orders** in the navbar
2. You will see all your past and current orders
3. Click on any order to open the **Order Detail** page
4. The current status is shown and updates automatically in real time:

```
PENDING → CONFIRMED → PREPARING → OUT FOR DELIVERY → DELIVERED
```

> Note: Order cancellation can only be done by the Admin from the admin panel.

---

### How to Remove Items from Cart (Customer)

1. Click the 🛒 cart icon in the navbar
2. To reduce quantity — click the **−** button next to the item
3. To remove completely — click the **✕** button next to the item
4. The cart total updates automatically
