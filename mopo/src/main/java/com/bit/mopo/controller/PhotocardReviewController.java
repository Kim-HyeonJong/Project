package com.bit.mopo.controller;


import com.bit.mopo.model.ReviewDto;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/photocard/{photocardId}/reviews/")
@AllArgsConstructor
public class PhotocardReviewController {
    private final ReviewService reviewService;

    private int selectMemberId() {
        return SecurityUtil.getCurrentMemberId();
    }

    // 특정 포카의 리뷰 목록 조회
    @GetMapping
    public Map<String, Object> showAllReviews(@PathVariable int photocardId) {
        Map<String, Object> map = new HashMap<>();
        try{
            List<ReviewDto> reviews = reviewService.selectReviewListByPhotocardId(photocardId);

            map.put("result", "success");
            map.put("reviews", reviews);

        } catch(Exception e){
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }

    // 리뷰 작성
    @PostMapping
    public Map<String, Object> submitReview(@PathVariable int photocardId,
                                            @RequestBody ReviewDto reviewDto) {
        Map<String, Object> map = new HashMap<>();
        try{

            int memberId = selectMemberId();

            reviewDto.setPhotocardId(photocardId);

            ReviewDto saved = reviewService.insertReview(memberId, reviewDto);

            map.put("result", "success");
            map.put("review", saved);
        }  catch(Exception e){
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }


}
