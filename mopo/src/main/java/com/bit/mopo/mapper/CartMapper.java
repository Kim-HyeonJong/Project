package com.bit.mopo.mapper;

import com.bit.mopo.model.cart.CartDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CartMapper {

    // 1. 내 장바구니 전체 조회
    List<CartDto> selectCartListByMemberId(int memberId);

    // 2. memberId + photocardId 로 장바구니 항목 1개 조회
    CartDto selectCartItemByMemberIdAndPhotocardId(Map<String, Object> params);

    // 3. 장바구니 새 항목 추가
    int insertCartItem(CartDto cartDto);

    // 4. cartItemId 기준 수량 변경
    int updateCartItemQuantityById(Map<String, Object> params);

    // 5. cartItemId로 장바구니 항목 조회
    CartDto selectCartItemById(int id);

    // 6. cartItemId로 항목 삭제
    int deleteCartItemById(int id);

    // 7. memberId 기준 장바구니 전체 삭제
    int deleteCartItemsByMemberId(int memberId);

    // 8. 체크아웃용: memberId + cartItemIds 리스트로 선택한 항목들 조회
    List<CartDto> selectCartItemsByIdsAndMemberId(Map<String, Object> params);

    // 9. 체크아웃용: memberId + cartItemIds 리스트로 선택 항목들 삭제
    int deleteCartItemsByIds(Map<String, Object> params);
}