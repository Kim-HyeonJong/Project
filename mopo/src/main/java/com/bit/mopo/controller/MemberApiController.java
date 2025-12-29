package com.bit.mopo.controller;

import com.bit.mopo.model.member.LoginRequest;
import com.bit.mopo.model.member.LoginResponse;
import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.model.member.RegisterRequest;
import com.bit.mopo.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/member/")
@AllArgsConstructor
public class MemberApiController {

    private final MemberService memberService;

    // 회원가입
    @PostMapping("register")
    public MemberDto register(@RequestBody RegisterRequest request) {

        return memberService.register(request);
    }

    // 로그인 (JWT 토큰 발급)
    @PostMapping("login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        Map<String, Object> map = new HashMap<>();
        try{
            LoginResponse loginResponse = memberService.login(request);
            map.put("loginResponse", loginResponse);
            map.put("result", "success");
        } catch (Exception e){
            e.printStackTrace();
            map.put("result", "fail");
        }
        return map;
    }
}
