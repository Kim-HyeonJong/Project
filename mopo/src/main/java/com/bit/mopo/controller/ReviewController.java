package com.bit.mopo.controller;

import com.bit.mopo.model.ReviewDto;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews/")
@AllArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    private int selectMemberId() {
        return SecurityUtil.getCurrentMemberId();
    }

    // 리뷰 수정
    @PatchMapping("{reviewId}")
    public Map<String, Object> updateReview(@PathVariable int reviewId,
                                            @RequestBody ReviewDto reviewDto) {
        Map<String, Object> map = new HashMap<>();
        try{
            int memberId = selectMemberId();

            ReviewDto updated = reviewService.updateReview(memberId, reviewId, reviewDto);

            map.put("result", "success");
            map.put("review", updated);

        } catch(Exception e){
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }

    // 리뷰 삭제
    @DeleteMapping("{reviewId}")
    public Map<String, Object> deleteReview(@PathVariable int reviewId) {
        Map<String, Object> map = new HashMap<>();
        try{
            int memberId = selectMemberId();

            reviewService.deleteReview(memberId, reviewId);

            map.put("result", "success");
            map.put("deletedId", reviewId);

        } catch(Exception e){
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }
}
