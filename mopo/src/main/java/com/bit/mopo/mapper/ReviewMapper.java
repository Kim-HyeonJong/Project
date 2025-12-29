package com.bit.mopo.mapper;

import com.bit.mopo.model.ReviewDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReviewMapper {

    // 특정 포토카드의 리뷰 목록 조회
    List<ReviewDto> selectReviewListByPhotocardId(int photocardId);

    // 리뷰 1건 조회 (수정/삭제 시 본인 글인지 확인용)
    ReviewDto selectReviewById(int id);

    // 리뷰 작성
    int insertReview(ReviewDto reviewDto);

    // 리뷰 수정
    int updateReview(ReviewDto reviewDto);

    // 리뷰 삭제
    int deleteReview(int id);
}