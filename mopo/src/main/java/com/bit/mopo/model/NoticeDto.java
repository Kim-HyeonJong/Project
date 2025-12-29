package com.bit.mopo.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NoticeDto {
    private Integer id;
    private Integer adminId; // Admin ID
    private String title; // Notice Title
    private String content; // Notice Content
    private String pinnedFlag; // Pinned Flag
    private LocalDateTime createdAt; // Create Local Date
    private LocalDateTime updatedAt; // Update Local Date
}
