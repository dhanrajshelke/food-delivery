CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(15),
    image_url TEXT,
    cuisine_type VARCHAR(100),
    rating DOUBLE DEFAULT 0.0,
    delivery_time INT,
    delivery_fee DOUBLE,
    is_open BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS food_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    is_veg BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    restaurant_id BIGINT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT,
    food_item_id BIGINT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    restaurant_id BIGINT,
    total_amount DOUBLE,
    delivery_address TEXT,
    status ENUM('PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') DEFAULT 'PENDING',
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP NULL,
    payment_method VARCHAR(50) DEFAULT 'CASH_ON_DELIVERY',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    food_item_id BIGINT,
    quantity INT,
    price DOUBLE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

INSERT INTO restaurants (name, description, address, city, phone, cuisine_type, rating, delivery_time, delivery_fee, is_open, image_url)
VALUES (
  'Shreyas Restaurant',
  'Authentic Maharashtrian thali and snacks',
  'FC Road, Shivajinagar, Pune',
  'Pune',
  '9823000000',
  'Maharashtrian',
  4.3,
  25,
  20.0,
  1,
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop'
);
