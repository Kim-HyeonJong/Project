package com.bit.mopo.impl;

import com.bit.mopo.mapper.MemberMapper;
import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.service.AdminMemberService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AdminMemberServiceImpl implements AdminMemberService {

    private final MemberMapper memberMapper;

    // need to make selectAll & updateRole// need to make selectAll & updateRole

    // 전체회원목록 조회
    @Override
    public List<MemberDto> selectMemberList() {
        return memberMapper.selectAll();
    }

    // 회원 한명 조회
    @Override
    public MemberDto selectMemberById(int memberId) {
        MemberDto member = memberMapper.selectById(memberId);
        if(member == null){
            throw new RuntimeException("존재하지 않는 회원입니다. memberId=" + memberId);
        }
        return member;
    }

    // 회원 Role 변경
    @Override
    public void updateMemberRole(int memberId, String role) {
        MemberDto member = memberMapper.selectById(memberId);
        if (member == null) {
            throw new RuntimeException("존재하지 않는 회원입니다. memberId=" + memberId);
        }
        if (role == null ||
                !(role.equals("ROLE_USER")
                        || role.equals("ROLE_SELLER")
                        || role.equals("ROLE_ADMIN"))) {
            throw new RuntimeException("지원하지 않는 권한입니다. role=" + role);
        }

        int updated = memberMapper.updateRole(memberId, role);
        if (updated == 0) {
            throw new RuntimeException("회원 권한 변경에 실패했습니다. memberId=" + memberId);
        }
    }
}


