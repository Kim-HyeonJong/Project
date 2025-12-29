package com.bit.mopo.mapper;

import com.bit.mopo.model.member.MemberDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MemberMapper {

    MemberDto selectById(int id);

    int updateProfile(Map<String, Object> params);

    int updatePassword(Map<String, Object> params);

    // 로그인용
    MemberDto selectByUsername(String username);

    // 회원가입용
    int register(MemberDto member);
    // 매퍼는 int로 두고, 서비스에서 void로 변환해서 리턴하는게 정석구조?

    // [관리자용 추가] 전체 회원 목록 조회
    List<MemberDto> selectAll();

    // [관리자용 추가] 회원 권한(role) 변경
    int updateRole(@Param("id") int id, @Param("role") String role);
}