package com.bit.mopo.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductInquiryDto {
    private int id;
    private int photocardId;
    private int memberId; // 문의한 유저의 아이디
    private String title; // 제목
    private String content; // 내용
    private String secretFlag; // 비밀글 여부 (YES or NO)
    private String answerContent; // 답변 내용
    private int answerMemberId; // 답변한 판매자
    private LocalDateTime answeredAt; // 답변 날짜
    private LocalDateTime createdAt; // 문의 작성일
}
