package com.bit.mopo.mapper;

import com.bit.mopo.model.AddressDto;
import com.bit.mopo.model.cart.CartDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AddressMapper {

    // 특정 회원 배송지 1개 조회 (어짜피 1개긴함)
    AddressDto selectAddressByMemberId(int memberId);

    // 주소id로 단건 조회 (수정/검증용)
    AddressDto selectAddressById(int id);

    // 새 주소 등록
    int insertAddress(AddressDto address);

    // 주소 수정
    int updateAddress(AddressDto address);

    // 주소 삭제
    int deleteAddress(int id);
}