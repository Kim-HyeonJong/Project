package com.bit.mopo.model.order;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Integer id; // can get null value before insert
    private int memberId;
    private String orderNumber; // Order Number
    private String status; // Order Status
    private int totalAmount; // Total Order Amount
    private String receiverName; // Receiver Name
    private String receiverPhone; // Receiver PhoneNumber
    private String zipcode; // Postcode
    private String addr; // Address
    private String addrDetail; // Detail Address
    private String message; // Delivery Message
    private LocalDateTime createdAt; // Created Local Date

    private List<OrderItemDto> items; // orderItems in orders from json
}
