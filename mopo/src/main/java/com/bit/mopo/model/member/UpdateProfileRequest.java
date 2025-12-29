package com.bit.mopo.model.member;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String username;
    private String nickname;
    private String phone;
    private String gender;
}