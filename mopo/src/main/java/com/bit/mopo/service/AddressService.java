package com.bit.mopo.service;

import com.bit.mopo.model.AddressDto;

public interface AddressService {

    // 로그인한 회원의 주소 1개 조회 (마이페이지 화면용입니다.)
    AddressDto selectAddressByMemberId(int memberId);

    AddressDto selectAddressById(int id);

    // 주소 등록
    AddressDto insertAddress(int memberId, AddressDto addressDto);

    // 주소 수정
    AddressDto updateAddress(int memberId, int addressId, AddressDto addressDto);

    // 주소 삭제 (필요하면 사용)
    void deleteAddress(int memberId, int addressId);
}