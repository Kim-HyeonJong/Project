package com.bit.mopo.impl;


import com.bit.mopo.mapper.AddressMapper;
import com.bit.mopo.model.AddressDto;
import com.bit.mopo.service.AddressService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressMapper addressMapper;

    @Override
    public AddressDto selectAddressByMemberId(int memberId) {
        return addressMapper.selectAddressByMemberId(memberId);
    }

    @Override
    public AddressDto selectAddressById(int id) {
        return addressMapper.selectAddressById(id);

    }

    @Override
    public AddressDto insertAddress(int memberId, AddressDto addressDto) {
        AddressDto existing = addressMapper.selectAddressByMemberId(memberId);
        if (existing != null) {
            throw new IllegalStateException("이미 등록된 주소가 있습니다.");
        }

        addressDto.setMemberId(memberId);

        addressMapper.insertAddress(addressDto);

        return addressMapper.selectAddressById(addressDto.getId());
    }

    @Override
    public AddressDto updateAddress(int memberId, int addressId, AddressDto addressDto) {
        AddressDto existing = addressMapper.selectAddressById(addressId);
        if (existing == null) {
            throw new IllegalArgumentException("존재하지 않는 주소입니다.");
        }

        if (existing.getMemberId() != memberId) {
            throw new IllegalStateException("본인의 주소가 아닙니다.");
        }

        addressDto.setId(addressId);
        addressDto.setMemberId(memberId);

        addressMapper.updateAddress(addressDto);

        return addressMapper.selectAddressById(addressId);
    }

    @Override
    public void deleteAddress(int memberId, int addressId) {
        AddressDto existing = addressMapper.selectAddressById(addressId);
        if (existing == null) {
            throw new IllegalArgumentException("존재하지 않는 주소입니다.");
        }

        if (existing.getMemberId() != memberId) {
            throw new IllegalStateException("본인의 주소가 아닙니다.");
        }

        addressMapper.deleteAddress(addressId);
    }
}