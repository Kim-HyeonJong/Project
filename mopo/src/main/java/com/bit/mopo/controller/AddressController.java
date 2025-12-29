package com.bit.mopo.controller;


import com.bit.mopo.mapper.MemberMapper;
import com.bit.mopo.model.AddressDto;
import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.security.JwtTokenProvider;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/address/")
@AllArgsConstructor
public class AddressController {
    private final AddressService addressService;

    // JWT → username 추출 후 DB 조회를 통해 memberId 획득
    private int selectMemberId() {
        return SecurityUtil.getCurrentMemberId();
    }

    // 내 주소 조회 (showOne)
    @GetMapping
    public Map<String, Object> showOne() {
        Map<String, Object> map = new HashMap<>();
        int memberId = selectMemberId();
        try {
            AddressDto address = addressService.selectAddressByMemberId(memberId);

            map.put("result", "success");
            map.put("address", address);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }

    // 주소 등록
    @PostMapping
    public Map<String, Object> submitAddress(@RequestBody AddressDto addressDto) {
        Map<String, Object> map = new HashMap<>();
        int memberId = selectMemberId();
        try {
            AddressDto saved = addressService.insertAddress(memberId, addressDto);

            map.put("result", "success");
            map.put("address", saved);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }

    // 주소 수정
    @PatchMapping("/{addressId}")
    public Map<String, Object> updateAddress(@PathVariable int addressId,
                                             @RequestBody AddressDto addressDto) {

        Map<String, Object> map = new HashMap<>();
        int memberId = selectMemberId();
        try {
            AddressDto updated = addressService.updateAddress(memberId, addressId, addressDto);

            map.put("result", "success");
            map.put("address", updated);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }

    // 주소 삭제
    @DeleteMapping("/{addressId}")
    public Map<String, Object> deleteAddress(@PathVariable int addressId) {
        Map<String, Object> map = new HashMap<>();

        int memberId = selectMemberId();
        try {
            addressService.deleteAddress(memberId, addressId);
            map.put("result", "success");
            map.put("deletedId", addressId);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "failed");
            map.put("message", e.getMessage());
        }

        return map;
    }

}