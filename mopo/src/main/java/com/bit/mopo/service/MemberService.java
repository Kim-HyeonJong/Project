package com.bit.mopo.service;


import com.bit.mopo.model.member.LoginRequest;
import com.bit.mopo.model.member.LoginResponse;
import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.model.member.RegisterRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


public interface MemberService {

    // 회원가입
    MemberDto register(RegisterRequest request);

    // 로그인 (성공 시 JWT 포함된 LoginResponse 반환)
    LoginResponse login(LoginRequest request);

    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
