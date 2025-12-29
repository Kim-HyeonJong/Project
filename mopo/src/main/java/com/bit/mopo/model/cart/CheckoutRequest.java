package com.bit.mopo.model.cart;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {

    private List<Integer> cartItemIds;
    private int addressId;


}
