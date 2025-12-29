package com.bit.mopo.model.photocard;

import lombok.Data;

@Data
public class PhotocardImageDto {
    private int id;
    private int photocardId;
    private String imageUrl; // 이미지의 경로
    private int sortOrder; // 주문 노출 순서
}
