package com.bit.mopo.model.member;

import lombok.Data;

@Data
public class UpdatePasswordRequest {

    // 현재 비밀번호
    private String currentPassword;

    // 새 비밀번호
    private String newPassword;
}