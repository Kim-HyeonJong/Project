package com.bit.mopo.controller;

import com.bit.mopo.model.cart.AddCartItemRequest;
import com.bit.mopo.model.cart.CartDto;
import com.bit.mopo.model.cart.CheckoutRequest;
import com.bit.mopo.model.cart.UpdateCartItemRequest;
import com.bit.mopo.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart/")
@AllArgsConstructor
public class CartController {
    private final CartService cartService;

    // 내 장바구니 조회
    @GetMapping
    public List<CartDto> showMyCart() {
        return cartService.showMyCart();
    }

    // 장바구니에 포토카드 담기
    @PostMapping("")
    public List<CartDto> addToCart(@RequestBody AddCartItemRequest request) {
        return cartService.addToCart(request);
    }

    // 장바구니 항목 수량 변경
    @PatchMapping("{cartItemId}")
    public List<CartDto> updateQuantity(
            @PathVariable int cartItemId,
            @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateQuantity(cartItemId, request);
    }

    // 장바구니 항목 삭제
    @DeleteMapping("{cartItemId}")
    public List<CartDto> deleteCartItem(@PathVariable int cartItemId) {
        return cartService.deleteCartItem(cartItemId);
    }

    // 선택된 장바구니 항목들로 주문 생성 == order 생성.
    @PostMapping("checkout")
    public int checkout(@RequestBody CheckoutRequest request) {
        return cartService.checkout(request);
    }

    // 장바구니 전체 비우기
    @DeleteMapping("")
    public List<CartDto> clearCart() {
        return cartService.clearCart();
    }


}
