package com.fooddelivery.service;

import com.fooddelivery.controller.SseController;
import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.model.Cart;
import com.fooddelivery.model.CartItem;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.model.User;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Place a new order from the user's current cart.
     * Clears the cart after order is placed.
     */
    @Transactional
    public Order placeOrder(Long userId, OrderRequest request) {

        // Get user's cart
        Cart cart = cartService.getCart(userId);

        // Cart must not be empty
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Get user details
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found");
        }
        User user = userOptional.get();

        // Get restaurant from first cart item
        Restaurant restaurant = cart.getCartItems().get(0).getFoodItem().getRestaurant();

        // Build the order object
        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setStatus(Order.OrderStatus.PENDING);

        // Set delivery address — use request address or fall back to user's saved address
        if (request.getDeliveryAddress() != null && !request.getDeliveryAddress().isEmpty()) {
            order.setDeliveryAddress(request.getDeliveryAddress());
        } else {
            order.setDeliveryAddress(user.getAddress());
        }

        // Set payment method — use request value or default to cash on delivery
        if (request.getPaymentMethod() != null && !request.getPaymentMethod().isEmpty()) {
            order.setPaymentMethod(request.getPaymentMethod());
        } else {
            order.setPaymentMethod("CASH_ON_DELIVERY");
        }

        // Build order items from cart items and calculate total
        List<OrderItem> orderItems = new ArrayList<OrderItem>();
        double total = 0.0;

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getFoodItem().getPrice());

            double itemTotal = cartItem.getFoodItem().getPrice() * cartItem.getQuantity();
            total = total + itemTotal;

            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);

        // Save order to database
        Order savedOrder = orderRepository.save(order);

        // Clear the cart after placing order
        cartService.clearCart(userId);

        return savedOrder;
    }

    /**
     * Get all orders for a specific user, newest first.
     */
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByPlacedAtDesc(userId);
    }

    /**
     * Get a single order by its ID.
     */
    public Order getOrderById(Long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (!orderOptional.isPresent()) {
            throw new RuntimeException("Order not found");
        }
        return orderOptional.get();
    }

    /**
     * Get all orders in the system, newest first. Used by admin.
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByPlacedAtDesc();
    }

    /**
     * Update the status of an order. Sets deliveredAt timestamp if status is DELIVERED.
     * Also pushes a real-time SSE event to any connected user watching this order.
     */
    public Order updateStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(Order.OrderStatus.valueOf(status));

        if ("DELIVERED".equals(status)) {
            order.setDeliveredAt(LocalDateTime.now());
        }

        Order saved = orderRepository.save(order);

        // Push live update to user if they have the order page open
        SseController.pushStatusUpdate(orderId, status);

        return saved;
    }
}
