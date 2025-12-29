package com.bit.mopo.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SellerApplicationDto {
    private int id;
    private int memberId;
    private String agencyName; // 회사 이름
    private String description; // 사유
    private String status;
    private String rejectReason; // 반려 사유
    private LocalDateTime createdAt; // 신청일
    private LocalDateTime processedAt; // 처리일
    private int processedBy;
}
