package com.bit.mopo.controller;


import com.bit.mopo.model.member.MemberDto;
import com.bit.mopo.service.AdminMemberService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/members/")
@AllArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    // 전체 회원 목록 보기
    @GetMapping
    public Map<String, Object> showAllMembers() {
        Map<String, Object> map = new HashMap<>();

        try {
            List<MemberDto> members = adminMemberService.selectMemberList();
            map.put("result", "success");
            map.put("members", members);
        } catch (Exception e){
            e.printStackTrace();
            map.put("result", "error");
            map.put("message", e.getMessage());
        }
        return map;
    }

    // 회원 한 명 상세 보기
    @GetMapping("{memberId}")
    public Map<String, Object> showOneMember(@PathVariable int memberId) {
        Map<String, Object> map = new HashMap<>();

        try {
            MemberDto member = adminMemberService.selectMemberById(memberId);

            map.put("result", "success");
            map.put("member", member);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    // 회원 권한(role) 변경
    @PatchMapping("{memberId}/role")
    public Map<String, Object> updateMemberRole(@PathVariable int memberId,
                                                @RequestBody Map<String, String> body) {
        Map<String, Object> map = new HashMap<>();
        try{
            String role = body.get("role");
            adminMemberService.updateMemberRole(memberId, role);

            MemberDto updated = adminMemberService.selectMemberById(memberId);

            map.put("result", "success");
            map.put("member", updated);
        } catch (Exception e){
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }


        return map;
    }
}


