package com.bit.mopo.model.order;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderSellerResponse {
    private int orderItemId;
    private int orderId;
    private String orderNumber;
    private String status;
    private int totalAmount;
    private LocalDateTime createdAt; // order create time

    private String receiverName; // Receiver Name
    private String receiverPhone; // Receiver PhoneNumber
    private String zipcode; // Postcode
    private String address; // Address
    private String addressDetail; // Detail Address

    private int photocardId;
    private String photocardName;
    private String imageUrl;

    private int sellerId; // Seller ID

    private int quantity; // Count Quantities
    private int price; // Price
    private int amount; // Total Amount
}
