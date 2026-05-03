package com.fooddelivery.controller;

import com.fooddelivery.model.FoodItem;
import com.fooddelivery.service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<FoodItem>> getByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(foodItemService.getByRestaurant(restaurantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.getById(id));
    }
}
