package com.bit.mopo.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AddressDto {
    private int id;
    private int memberId; // User ID
    private String name; // Receiver Name
    private int zipcode; // Postcode
    private String addr; // Address
    private String addrDetail; // Detail Address
    private String phone; // Phone Number
    private String isDefault; // Default Address Flag (YES or NO)
    private LocalDateTime createdAt; // Created Local Date
}
