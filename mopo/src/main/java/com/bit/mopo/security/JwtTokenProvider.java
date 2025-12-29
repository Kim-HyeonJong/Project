
package com.bit.mopo.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@AllArgsConstructor
public class JwtTokenProvider {
    private final SecretKey key = Keys.hmacShaKeyFor(
            "my-very-very-very-strong-secret-key-1234567890"
                    .getBytes(StandardCharsets.UTF_8)
    );
    private final long validTime = 1000L * 60 * 60 * 3;

    public String selectUsername(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // token 안의 id 꺼내기
    public Integer selectMemberId(String token) {
        var claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("id", Integer.class);
    }

    public List<String> selectRoles(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("roles", List.class);
    }


    // 토큰 생성 – 예전에 쓰던 코드 그대로
    public String createToken(String username, List<String> roles, int id) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("id", id);
        Date now = new Date();
        Date validity = new Date(now.getTime() + validTime);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key)
                .compact();
    }

    public String resolveToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            // 만료시간이 현재보다 "이전이면" 만료된 것 → before(new Date()) == true
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // JwtTokenProvider → Service Remove dependence issue
    // 토큰으로부터 Authentication 만들기
    /*public Authentication getAuthentication(String token) {
        String username = selectUsername(token);

        UserDetails user = memberService.loadUserByUsername(username);

        return new UsernamePasswordAuthenticationToken(
                user,
                "",
                user.getAuthorities()
        );
    }*/


}



