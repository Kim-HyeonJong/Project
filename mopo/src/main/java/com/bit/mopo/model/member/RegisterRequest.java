package com.bit.mopo.model.member;

import lombok.Data;

@Data
public class RegisterRequest { // 회원가입 받을때 쓰는dto

    private String username;
    private String password;
    private String nickname;
    private String phone;
    private String gender;
}