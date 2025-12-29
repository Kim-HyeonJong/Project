package com.bit.mopo.controller;

import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.model.member.UpdatePasswordRequest;
import com.bit.mopo.model.member.UpdateProfileRequest;
import com.bit.mopo.service.MyPageService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage/")
@AllArgsConstructor
public class MyPageController {
    private final MyPageService myPageService;

    // 마이페이지 내 프로필 조회
    @GetMapping("profile")
    public MemberDto showMyProfile() {
        return myPageService.showMyProfile();
    }
    // 마이페이지 내 프로필 수정 (비밀번호 제외 다른정보 수정)
    @PatchMapping("profile")
    public MemberDto updateMyProfile(@RequestBody UpdateProfileRequest request) {
        return myPageService.updateMyProfile(request);
    }

    // 마이페이지 내 프로필 수정 (비밀번호 수정 - 로그인 풀려야함)
    @PatchMapping("profile/password")
    public MemberDto updatePassword(@RequestBody UpdatePasswordRequest request) {
        return myPageService.updatePassword(request);
    }
}



