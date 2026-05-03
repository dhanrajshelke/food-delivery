package com.fooddelivery.service;

import com.fooddelivery.model.FoodItem;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {

    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private RestaurantRepository restaurantRepository;

    public List<FoodItem> getByRestaurant(Long restaurantId) {
        return foodItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
    }

    public List<FoodItem> getAllByRestaurant(Long restaurantId) {
        return foodItemRepository.findByRestaurantId(restaurantId);
    }

    public FoodItem getById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found"));
    }

    public FoodItem create(Long restaurantId, FoodItem foodItem) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        foodItem.setRestaurant(restaurant);
        return foodItemRepository.save(foodItem);
    }

    public FoodItem update(Long id, FoodItem updated) {
        FoodItem existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setImageUrl(updated.getImageUrl());
        existing.setCategory(updated.getCategory());
        existing.setIsVeg(updated.getIsVeg());
        existing.setIsAvailable(updated.getIsAvailable());
        return foodItemRepository.save(existing);
    }

    public void delete(Long id) {
        foodItemRepository.deleteById(id);
    }
}
