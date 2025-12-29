package com.bit.mopo.service;

import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.model.member.UpdatePasswordRequest;
import com.bit.mopo.model.member.UpdateProfileRequest;

public interface MyPageService {

    // 내 프로필 조회
    MemberDto showMyProfile();

    // 일반정보 수정
    MemberDto updateMyProfile(UpdateProfileRequest request);

    // 비밀번호 수정
    MemberDto updatePassword(UpdatePasswordRequest request);
}
