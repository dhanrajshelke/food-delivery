package com.fooddelivery.config;

import com.fooddelivery.model.*;
import com.fooddelivery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedRestaurants();
    }

    private void seedUsers() {
        // Only create if not already exists — prevents double-encoding password on restart
        if (!userRepository.existsByEmail("dhanrajshelke11@gmail.com")) {
            User admin = new User();
            admin.setName("Dhanraj Shelke");
            admin.setEmail("dhanrajshelke11@gmail.com");
            admin.setPassword(passwordEncoder.encode("dhanraj@98"));
            admin.setPhone("9834000000");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("parththube11@gmail.com")) {
            User user = new User();
            user.setName("Parth Thube");
            user.setEmail("parththube11@gmail.com");
            user.setPassword(passwordEncoder.encode("Parth@9423"));
            user.setPhone("9423000000");
            user.setAddress("123 Main Street, Pune");
            user.setRole(User.Role.USER);
            userRepository.save(user);
        }
    }

    private void seedRestaurants() {
        if (restaurantRepository.count() > 0) return;

        // 1. Punjabi Tadka
        Restaurant r1 = save("Punjabi Tadka", "Rich North Indian curries and tandoor specialties",
                "12 FC Road, Pune", "Pune", "020-11223344", "North Indian",
                4.5, 30, 30.0, "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop");
        addFood(r1, "Butter Chicken", "Creamy tomato-based chicken curry", 280.0, "Main Course", false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300");
        addFood(r1, "Dal Makhani", "Slow-cooked black lentils in butter", 180.0, "Main Course", true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300");
        addFood(r1, "Paneer Tikka", "Grilled cottage cheese with spices", 220.0, "Starter", true, "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300");
        addFood(r1, "Garlic Naan", "Soft bread with garlic butter", 60.0, "Bread", true, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300");
        addFood(r1, "Lassi", "Sweet chilled yogurt drink", 80.0, "Beverages", true, "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300");

        // 2. Dakshin Rasoi
        Restaurant r2 = save("Dakshin Rasoi", "Authentic South Indian tiffin and meals",
                "45 Shivaji Nagar, Bangalore", "Bangalore", "080-22334455", "South Indian",
                4.3, 25, 20.0, "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop");
        addFood(r2, "Masala Dosa", "Crispy dosa with spiced potato filling", 120.0, "Tiffin", true, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300");
        addFood(r2, "Idli Sambar", "Steamed rice cakes with lentil soup", 90.0, "Tiffin", true, "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300");
        addFood(r2, "Vada", "Crispy lentil fritters", 70.0, "Starter", true, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300");
        addFood(r2, "Chettinad Chicken Curry", "Spicy South Indian chicken curry", 260.0, "Main Course", false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300");
        addFood(r2, "Filter Coffee", "Traditional South Indian filter coffee", 60.0, "Beverages", true, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300");

        // 3. Mumbai Chowpatty
        Restaurant r3 = save("Mumbai Chowpatty", "Famous Mumbai street food and chaats",
                "78 Linking Road, Mumbai", "Mumbai", "022-33445566", "Street Food",
                4.2, 20, 15.0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop");
        addFood(r3, "Pav Bhaji", "Spiced vegetable mash with buttered pav", 120.0, "Street Food", true, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300");
        addFood(r3, "Vada Pav", "Mumbai's favourite spicy potato burger", 40.0, "Street Food", true, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300");
        addFood(r3, "Sev Puri", "Crispy puris with chutneys and sev", 80.0, "Chaat", true, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300");
        addFood(r3, "Bhel Puri", "Puffed rice with tangy tamarind chutney", 70.0, "Chaat", true, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300");
        addFood(r3, "Cutting Chai", "Strong Mumbai-style half tea", 20.0, "Beverages", true, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300");

        // 4. Hyderabadi Dawat
        Restaurant r4 = save("Hyderabadi Dawat", "Royal Hyderabadi biryani and kebabs",
                "56 Banjara Hills, Hyderabad", "Hyderabad", "040-44556677", "Hyderabadi",
                4.7, 35, 40.0, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop");
        addFood(r4, "Chicken Dum Biryani", "Slow-cooked aromatic chicken biryani", 320.0, "Biryani", false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300");
        addFood(r4, "Mutton Biryani", "Tender mutton in fragrant basmati rice", 380.0, "Biryani", false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300");
        addFood(r4, "Veg Biryani", "Aromatic vegetable biryani", 220.0, "Biryani", true, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300");
        addFood(r4, "Seekh Kebab", "Minced meat kebabs from tandoor", 280.0, "Starter", false, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300");
        addFood(r4, "Double Ka Meetha", "Hyderabadi bread pudding dessert", 120.0, "Desserts", true, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300");

        // 5. Rajwada Kitchen
        Restaurant r5 = save("Rajwada Kitchen", "Traditional Rajasthani thali and sweets",
                "34 MI Road, Jaipur", "Jaipur", "0141-55667788", "Rajasthani",
                4.4, 40, 35.0, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop");
        addFood(r5, "Dal Baati Churma", "Baked wheat balls with lentils and sweet churma", 250.0, "Main Course", true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300");
        addFood(r5, "Laal Maas", "Fiery Rajasthani mutton curry", 340.0, "Main Course", false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300");
        addFood(r5, "Gatte ki Sabzi", "Gram flour dumplings in spicy gravy", 180.0, "Main Course", true, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300");
        addFood(r5, "Pyaaz Kachori", "Crispy pastry stuffed with spiced onions", 60.0, "Snacks", true, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300");
        addFood(r5, "Ghevar", "Traditional Rajasthani sweet with rabri", 150.0, "Desserts", true, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300");

        // 6. Bengali Bhoj
        Restaurant r6 = save("Bengali Bhoj", "Authentic Bengali fish curries and sweets",
                "90 Park Street, Kolkata", "Kolkata", "033-66778899", "Bengali",
                4.1, 30, 25.0, "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop");
        addFood(r6, "Macher Jhol", "Light Bengali fish curry with potatoes", 280.0, "Main Course", false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300");
        addFood(r6, "Kosha Mangsho", "Slow-cooked spicy mutton curry", 360.0, "Main Course", false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300");
        addFood(r6, "Shorshe Ilish", "Hilsa fish in mustard sauce", 420.0, "Main Course", false, "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300");
        addFood(r6, "Mishti Doi", "Sweet Bengali yogurt dessert", 80.0, "Desserts", true, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300");
        addFood(r6, "Rasgulla", "Soft cottage cheese balls in sugar syrup", 60.0, "Desserts", true, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300");
    }

    private Restaurant save(String name, String desc, String address, String city,
                             String phone, String cuisine, Double rating,
                             Integer deliveryTime, Double deliveryFee, String imageUrl) {
        Restaurant r = new Restaurant();
        r.setName(name); r.setDescription(desc); r.setAddress(address);
        r.setCity(city); r.setPhone(phone); r.setCuisineType(cuisine);
        r.setRating(rating); r.setDeliveryTime(deliveryTime);
        r.setDeliveryFee(deliveryFee); r.setIsOpen(true); r.setImageUrl(imageUrl);
        return restaurantRepository.save(r);
    }

    private void addFood(Restaurant r, String name, String desc, Double price,
                         String category, Boolean isVeg, String imageUrl) {
        FoodItem item = new FoodItem();
        item.setName(name); item.setDescription(desc); item.setPrice(price);
        item.setCategory(category); item.setIsVeg(isVeg);
        item.setIsAvailable(true); item.setImageUrl(imageUrl);
        item.setRestaurant(r);
        foodItemRepository.save(item);
    }
}
