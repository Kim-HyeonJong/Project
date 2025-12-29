package com.bit.mopo.impl;

import com.bit.mopo.mapper.MemberMapper;
import com.bit.mopo.model.member.*;
import com.bit.mopo.security.JwtTokenProvider;
import com.bit.mopo.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @Override
    public MemberDto register(RegisterRequest request) {

        // 1. 아이디 중복 체크
        MemberDto existing = memberMapper.selectByUsername(request.getUsername());
        if (existing != null) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        // 2. RegisterRequest -> MemberDto 매핑
        MemberDto member = new MemberDto();
        member.setUsername(request.getUsername());
        member.setPassword(passwordEncoder.encode(request.getPassword()));
        member.setNickname(request.getNickname());
        member.setPhone(request.getPhone());
        member.setGender(request.getGender());

        // 기본 권한 설정 (user / seller / admin 중 기본은 user라고 가정)
        member.setRole("ROLE_USER");

        // status, createdAt, updatedAt 은 DB/기본값으로 처리 (여기서 안 건드림)

        // 3. DB insert
        int result = memberMapper.register(member);
        if (result != 1) {
            throw new RuntimeException("회원가입에 실패했습니다.");
        }

        // 4. 방금 가입한 회원 다시 조회해서 반환 (id 포함)
        MemberDto saved = memberMapper.selectByUsername(member.getUsername());
        if (saved == null) {
            throw new RuntimeException("회원 정보를 다시 조회할 수 없습니다.");
        }

        return saved;
    }

    // 로그인
    @Override
    public LoginResponse login(LoginRequest request) {

        // 1. 아이디로 회원 조회
        MemberDto member = memberMapper.selectByUsername(request.getUsername());
        if (member == null) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 2. 비밀번호 검증 (BCrypt)
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. JWT 토큰 생성
        List<String> roles = List.of(member.getRole()); // role: USER / SELLER / ADMIN
        String token = jwtTokenProvider.createToken(
                member.getUsername(),
                roles,
                member.getId()
        );

        // 4. 응답 DTO 구성
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setMemberId(member.getId());
        response.setUsername(member.getUsername());
        response.setNickname(member.getNickname());
        response.setRole(member.getRole());

        return response;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MemberDto member = memberMapper.selectByUsername(username);
        if (member == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }

        CustomUserDetails user = new CustomUserDetails();
        user.setId(member.getId());
        user.setUsername(member.getUsername());
        user.setPassword(member.getPassword());
        user.setNickname(member.getNickname());
        user.setRole(member.getRole());

        return user;
    }

}





