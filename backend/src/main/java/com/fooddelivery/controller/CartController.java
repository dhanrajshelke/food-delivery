package com.fooddelivery.controller;

import com.fooddelivery.dto.CartItemRequest;
import com.fooddelivery.model.Cart;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired private CartService cartService;
    @Autowired private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCart(getUserId(userDetails)));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addItem(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(getUserId(userDetails), request));
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<Cart> updateItem(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable Long cartItemId,
                                           @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateItem(getUserId(userDetails), cartItemId, quantity));
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<Cart> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeItem(getUserId(userDetails), cartItemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(getUserId(userDetails));
        return ResponseEntity.ok().build();
    }
}
