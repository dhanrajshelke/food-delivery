package com.fooddelivery.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"cart", "orders", "password", "hibernateLazyInitializer"})
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<CartItem>();

    /**
     * Calculates total amount by iterating all cart items.
     * Each item price multiplied by quantity then summed up.
     */
    public Double getTotalAmount() {
        double total = 0.0;
        for (CartItem item : cartItems) {
            double itemPrice = item.getFoodItem().getPrice();
            int itemQty = item.getQuantity();
            total = total + (itemPrice * itemQty);
        }
        return total;
    }
}
