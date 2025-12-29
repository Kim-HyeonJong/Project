package com.bit.mopo.service;

import com.bit.mopo.model.ReviewDto;

import java.util.List;

public interface ReviewService {

    // 특정 포토카드에 대한 리뷰 목록 조회
    List<ReviewDto> selectReviewListByPhotocardId(int photocardId);

    // 리뷰 1건 조회 (필요하면 상세/검증용)
    ReviewDto selectReviewById(int reviewId);

    // 리뷰 작성
    // memberId는 SecurityUtil에서 가져온 로그인 회원 번호
    ReviewDto insertReview(int memberId, ReviewDto reviewDto);

    // 리뷰 수정
    ReviewDto updateReview(int memberId, int reviewId, ReviewDto reviewDto);

    // 리뷰 삭제
    void deleteReview(int memberId, int reviewId);
}