package com.bit.mopo.impl;


import com.bit.mopo.mapper.ReviewMapper;
import com.bit.mopo.model.ReviewDto;
import com.bit.mopo.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;

    @Override
    public List<ReviewDto> selectReviewListByPhotocardId(int photocardId) {
        return reviewMapper.selectReviewListByPhotocardId(photocardId);
    }

    @Override
    public ReviewDto selectReviewById(int reviewId) {
        ReviewDto review = reviewMapper.selectReviewById(reviewId);
        if (review == null) {
            throw new RuntimeException("존재하지 않는 리뷰입니다.");
        }
        return review;
    }

    @Override
    public ReviewDto insertReview(int memberId, ReviewDto reviewDto) {
        reviewDto.setMemberId(memberId);
        int rating = reviewDto.getRating();
        if (rating > 10) {
            reviewDto.setRating(10);
        } else if (rating < 0) {
            reviewDto.setRating(0);
        }
        reviewMapper.insertReview(reviewDto);
        return reviewMapper.selectReviewById(reviewDto.getId());
    }

    @Override
    public ReviewDto updateReview(int memberId, int reviewId, ReviewDto reviewDto) {
        ReviewDto existing = reviewMapper.selectReviewById(reviewId);
        if (existing == null) {
            throw new RuntimeException("존재하지 않는 리뷰입니다.");
        }

        if (existing.getMemberId() != memberId) {
            throw new RuntimeException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }

        existing.setRating(reviewDto.getRating());
        existing.setContent(reviewDto.getContent());

        reviewMapper.updateReview(existing);

        return reviewMapper.selectReviewById(reviewId);
    }

    @Override
    public void deleteReview(int memberId, int reviewId) {

        ReviewDto existing = reviewMapper.selectReviewById(reviewId);
        if (existing == null) {
            throw new RuntimeException("존재하지 않는 리뷰입니다.");
        }

        if (existing.getMemberId() != memberId) {
            throw new RuntimeException("본인이 작성한 리뷰만 삭제할 수 있습니다.");
        }

        reviewMapper.deleteReview(reviewId);
    }
}