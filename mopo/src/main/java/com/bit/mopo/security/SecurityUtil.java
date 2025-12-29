package com.bit.mopo.security;

import com.bit.mopo.model.member.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {
    public static int getCurrentMemberId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new RuntimeException("인증 정보가 없습니다.");
        }

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        return user.getId();
    }

}
