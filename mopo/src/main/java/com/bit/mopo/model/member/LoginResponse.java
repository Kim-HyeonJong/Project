package com.bit.mopo.model.member;

import lombok.Data;

@Data
public class LoginResponse {

    // Login Response(로그인 시 다음 할것)에 token으로 묶어서 넣었다(?)
    private String token;
    private int memberId;
    private String username;
    private String nickname;
    private String role;
}