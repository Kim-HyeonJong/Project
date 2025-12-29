package com.bit.mopo.model.cart;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CartDto { // 장바구니
    private int id; // 장바구니 id?
    private int memberId;
    private int photocardId;
    private int quantity;
    private LocalDateTime createdAt; // 담은시간
}
