package com.bit.mopo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private int id;
    private int photocardId;
    private int memberId;
    private String nickname;
    private int rating; // 별점
    private String content; // 리뷰 내용
    private LocalDateTime createdAt; // 리뷰 생성일
    private LocalDateTime updatedAt; // 리뷰 업데이트일
}
