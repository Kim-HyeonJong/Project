package com.bit.mopo.impl;

import com.bit.mopo.mapper.MemberMapper;
import com.bit.mopo.model.member.CustomUserDetails;
import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.model.member.UpdatePasswordRequest;
import com.bit.mopo.model.member.UpdateProfileRequest;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.MyPageService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class MyPageServiceImpl implements MyPageService {
    private final MemberMapper memberMapper;

    // 내 프로필 조회
    @Override
    public MemberDto showMyProfile() {
        int memberId = SecurityUtil.getCurrentMemberId();
        return memberMapper.selectById(memberId);
    }

    // 일반정보수정

    @Override
    public MemberDto updateMyProfile(UpdateProfileRequest request) {
        int memberId = SecurityUtil.getCurrentMemberId();

        Map<String, Object> params = new HashMap<>();
        params.put("id", memberId);

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            params.put("username", request.getUsername());
        }
        if (request.getNickname() != null && !request.getNickname().isBlank()) {
            params.put("nickname", request.getNickname());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            params.put("phone", request.getPhone());
        }
        if (request.getGender() != null && !request.getGender().isBlank()) {
            params.put("gender", request.getGender());
        }

        // id 말고 수정할 값이 하나라도 있을 때만 업데이트
        if (params.size() > 1) {
            memberMapper.updateProfile(params);
        }

        // 최신 프로필 다시 조회해서 반환
        return memberMapper.selectById(memberId);
    }


    // 3. 비밀번호 변경
    @Override
    public MemberDto updatePassword(UpdatePasswordRequest request) {
        int memberId = SecurityUtil.getCurrentMemberId();

        MemberDto member = memberMapper.selectById(memberId);

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        if (!encoder.matches(request.getCurrentPassword(), member.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        String newEncodedPw = encoder.encode(request.getNewPassword());

        Map<String, Object> params = new HashMap<>();
        params.put("id", memberId);
        params.put("newPassword", newEncodedPw);

        memberMapper.updatePassword(params);

        return memberMapper.selectById(memberId);
    }


}







