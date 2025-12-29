package com.bit.mopo.model.order;

import lombok.Data;

@Data
public class OrderItemDto {
    private int id; // ID
    private int orderId; // Order ID
    private int photocardId; // Photocard ID
    private int sellerId; // Seller ID
    private int quantity; // Count Quantities
    private int price; // Price
    private int amount; // Total Amount

    private String photocardName;
    private String imageUrl;
}
