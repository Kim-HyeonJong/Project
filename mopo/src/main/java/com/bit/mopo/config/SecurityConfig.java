package com.bit.mopo.config;

import com.bit.mopo.security.JwtTokenProvider;
import com.bit.mopo.security.JwtAuthFilter;
import com.bit.mopo.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {
    private final JwtTokenProvider jwtTokenProvider;
    // JwtTokenProvider → Service Remove dependence issue
    // SecurityConfig -> JwtAuthFilter get param memberService
    private final MemberService memberService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // 공개 API로 공개합니다.
                        .requestMatchers("/",
                                "/api/member/login",
                                "/api/member/register",

                                // photocard 조회
                                "/api/photocard/showAll/**",
                                "/api/photocard/showOne/**",
                                "/api/photocard/*/view",
                                "/api/photocard/*/reviews/**",

                                // notice 조회
                                "/api/notice/showAll/**",
                                "/api/notice/showOne/**",

                                "/uploads/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // 재고 차감 API: USER도 호출 가능
                        .requestMatchers(HttpMethod.PATCH, "/api/photocard/*/stock")
                        .hasAnyRole("USER", "SELLER", "ADMIN")

                        // 포토카드 수정/등록/삭제: SELLER + ADMIN
                        .requestMatchers("/api/photocard/**")
                        .hasAnyRole("SELLER", "ADMIN")

                        // 관리자 공지사항 API (조회는 permitAll 했으므로 안전함)
                        .requestMatchers("/api/notice/**")
                        .hasRole("ADMIN")

                        // 관리자 전용
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // 판매자 전용 주문 처리 API
                        .requestMatchers("/api/order/seller")
                        .hasRole("SELLER")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                new JwtAuthFilter(jwtTokenProvider, memberService),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}