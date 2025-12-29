package com.bit.mopo.service;

import com.bit.mopo.model.cart.CartDto;
import com.bit.mopo.model.cart.AddCartItemRequest;
import com.bit.mopo.model.cart.CheckoutRequest;
import com.bit.mopo.model.cart.UpdateCartItemRequest;

import java.util.List;

public interface CartService {

    List<CartDto> showMyCart();

    List<CartDto> addToCart(AddCartItemRequest request);

    List<CartDto> updateQuantity(int cartItemId, UpdateCartItemRequest request);

    List<CartDto> deleteCartItem(int cartItemId);

    int checkout(CheckoutRequest request);

    List<CartDto> clearCart();
}
