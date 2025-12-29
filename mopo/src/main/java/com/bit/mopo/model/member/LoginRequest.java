package com.bit.mopo.model.member;


import lombok.Data;

@Data
public class LoginRequest { // 로그인 요청 dto

    private String username;
    private String password;
}