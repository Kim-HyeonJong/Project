package com.bit.mopo.model.cart;

import lombok.Data;

@Data
public class AddCartItemRequest {
    public int photocardId;
    public int quantity;
}
