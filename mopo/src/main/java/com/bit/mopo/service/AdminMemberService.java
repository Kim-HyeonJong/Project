package com.bit.mopo.service;

import com.bit.mopo.model.member.MemberDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminMemberService {

    // 회원목록조회
    List<MemberDto> selectMemberList();

    // 회원 한 명 상세 조회
    MemberDto selectMemberById(int memberId);

    // 회원 권한(role) 변경
    void updateMemberRole(int memberId, String role);
}

