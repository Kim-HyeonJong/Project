package com.bit.mopo.impl;

import com.bit.mopo.mapper.CartMapper;
import com.bit.mopo.model.cart.AddCartItemRequest;
import com.bit.mopo.model.cart.CartDto;
import com.bit.mopo.model.cart.CheckoutRequest;
import com.bit.mopo.model.cart.UpdateCartItemRequest;
import com.bit.mopo.security.JwtTokenProvider;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartMapper cartMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final HttpServletRequest request;


    // 내 장바구니 조회
    @Override
    public List<CartDto> showMyCart() {
        int memberId = SecurityUtil.getCurrentMemberId();
        return cartMapper.selectCartListByMemberId(memberId);
    }

    // 장바구니 담기
    @Override
    public List<CartDto> addToCart(AddCartItemRequest request) {
        int memberId = SecurityUtil.getCurrentMemberId();
        int photocardId = request.getPhotocardId();
        int quantity = request.getQuantity();

        // 1) 이미 있는지 확인
        Map<String, Object> checkMap = new HashMap<>();
        checkMap.put("memberId", memberId);
        checkMap.put("photocardId", photocardId);

        CartDto existing = cartMapper.selectCartItemByMemberIdAndPhotocardId(checkMap);

        if (existing != null) {
            // 있으면 수량 증가
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("id", existing.getId());
            updateMap.put("quantity", existing.getQuantity() + quantity);
            cartMapper.updateCartItemQuantityById(updateMap);
        } else {
            // 없으면 새로 추가
            CartDto dto = new CartDto();
            dto.setMemberId(memberId);
            dto.setPhotocardId(photocardId);
            dto.setQuantity(quantity);
            cartMapper.insertCartItem(dto);
        }
        return cartMapper.selectCartListByMemberId(memberId);
    }

    // 수량 변경
    @Override
    public List<CartDto> updateQuantity(int cartItemId, UpdateCartItemRequest request) {
        int memberId = SecurityUtil.getCurrentMemberId();

        // 내 장바구니 항목 맞는지 확인
        CartDto item = cartMapper.selectCartItemById(cartItemId);
        if (item == null || item.getMemberId() != memberId) {
            throw new RuntimeException("해당 장바구니 권한 없음");
        }

        // 변경
        Map<String, Object> updateMap = new HashMap<>();
        updateMap.put("id", cartItemId);
        updateMap.put("quantity", request.getQuantity());

        cartMapper.updateCartItemQuantityById(updateMap);

        return cartMapper.selectCartListByMemberId(memberId);
    }

    // 장바구니 항목 삭제
    @Override
    public List<CartDto> deleteCartItem(int cartItemId) {
        int memberId = SecurityUtil.getCurrentMemberId();

        CartDto item = cartMapper.selectCartItemById(cartItemId);
        if (item == null || item.getMemberId() != memberId) {
            throw new RuntimeException("삭제할 수 없습니다.");
        }

        cartMapper.deleteCartItemById(cartItemId);

        return cartMapper.selectCartListByMemberId(memberId);
    }

    // 체크아웃(선택된 cartItemIds로 주문 생성)
    @Override
    public int checkout(CheckoutRequest request) {
        int memberId = SecurityUtil.getCurrentMemberId();
        List<Integer> cartItemIds = request.getCartItemIds();

        // 내 장바구니 항목 조회
        Map<String, Object> map = new HashMap<>();
        map.put("memberId", memberId);
        map.put("cartItemIds", cartItemIds);

        List<CartDto> items = cartMapper.selectCartItemsByIdsAndMemberId(map);

        if (items.isEmpty()) {
            throw new RuntimeException("주문할 장바구니 항목이 없습니다.");
        }

        // cart_item 삭제 (선택된 것만)
        cartMapper.deleteCartItemsByIds(map);

        // 여기 아래는 주문부분 ( 아직 X )
        // ==========================================================================


        // 3) return orderId (임시 999)
        return 999;   // 나중에 실제 OrderService에서 만든 orderId return
    }

    // 장바구니 전체 비우기
    @Override
    public List<CartDto> clearCart() {
        int memberId = SecurityUtil.getCurrentMemberId();
        cartMapper.deleteCartItemsByMemberId(memberId);
        return cartMapper.selectCartListByMemberId(memberId);

    }


}