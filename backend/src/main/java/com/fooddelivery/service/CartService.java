package com.fooddelivery.service;

import com.fooddelivery.dto.CartItemRequest;
import com.fooddelivery.model.Cart;
import com.fooddelivery.model.CartItem;
import com.fooddelivery.model.FoodItem;
import com.fooddelivery.model.User;
import com.fooddelivery.repository.CartItemRepository;
import com.fooddelivery.repository.CartRepository;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get cart for user. If no cart exists, create a new one.
     */
    public Cart getCart(Long userId) {
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);

        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        // Cart does not exist — create a new one for this user
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found");
        }

        Cart newCart = new Cart();
        newCart.setUser(userOptional.get());
        return cartRepository.save(newCart);
    }

    /**
     * Add a food item to the cart. If item already exists, increase quantity.
     */
    @Transactional
    public Cart addItem(Long userId, CartItemRequest request) {
        Cart cart = getCart(userId);

        Optional<FoodItem> foodItemOptional = foodItemRepository.findById(request.getFoodItemId());
        if (!foodItemOptional.isPresent()) {
            throw new RuntimeException("Food item not found");
        }
        FoodItem foodItem = foodItemOptional.get();

        // Check if this food item is already in the cart
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndFoodItemId(cart.getId(), foodItem.getId());

        if (existingItem.isPresent()) {
            // Item already in cart — just increase quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            // Item not in cart — add as new cart item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setFoodItem(foodItem);
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }

        // Return refreshed cart
        Optional<Cart> updatedCart = cartRepository.findById(cart.getId());
        if (!updatedCart.isPresent()) {
            throw new RuntimeException("Cart not found after update");
        }
        return updatedCart.get();
    }

    /**
     * Update quantity of a cart item. If quantity is 0 or less, remove the item.
     */
    @Transactional
    public Cart updateItem(Long userId, Long cartItemId, Integer quantity) {
        Cart cart = getCart(userId);

        Optional<CartItem> itemOptional = cartItemRepository.findById(cartItemId);
        if (!itemOptional.isPresent()) {
            throw new RuntimeException("Cart item not found");
        }
        CartItem item = itemOptional.get();

        if (quantity <= 0) {
            // Remove item from cart
            cartItemRepository.delete(item);
        } else {
            // Update quantity
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        Optional<Cart> updatedCart = cartRepository.findById(cart.getId());
        if (!updatedCart.isPresent()) {
            throw new RuntimeException("Cart not found after update");
        }
        return updatedCart.get();
    }

    /**
     * Remove a specific item from the cart.
     */
    @Transactional
    public Cart removeItem(Long userId, Long cartItemId) {
        Cart cart = getCart(userId);
        cartItemRepository.deleteById(cartItemId);

        Optional<Cart> updatedCart = cartRepository.findById(cart.getId());
        if (!updatedCart.isPresent()) {
            throw new RuntimeException("Cart not found after remove");
        }
        return updatedCart.get();
    }

    /**
     * Clear all items from the cart.
     */
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCart(userId);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
}
