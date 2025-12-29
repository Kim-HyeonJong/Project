package com.bit.mopo.model.photocard;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PhotocardDto {
    private Integer id;
    private String artistName; // Artist&Group Name
    private String artistType; // Artist&Group Type ... etc
    private int sellerId; // Seller ID
    private String name; // Photocard Name
    private String limitedFlag; // Limit (YES or NO)
    private String photoType;
    private String signType;
    private String messageFlag; // Message (YES or NO)
    private String effectType; // Effect
    private String coatingType; // Coating
    private String sizeType; // Size
    private int widthMm;
    private int heightMm;
    private int thicknessMm;
    private String material;
    private String coatingMaterial;
    private String conditionGrade;
    private String printQuality;
    private int basePrice;
    private int salePrice;
    private int stock;
    private String status;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String deletedFlag;

    private String tempFileName;
    private String imageUrl;
}
