package com.bit.mopo.model.member;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MemberDto {
    private int id;
    private String username; // 유저 아이디
    private String nickname;
    private String password;
    private String phone;
    private String gender;
    private String role; // user, seller, admin
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // active, deactive, delete
}
