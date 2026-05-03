package com.fooddelivery.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String deliveryAddress;
    private String paymentMethod;
}
