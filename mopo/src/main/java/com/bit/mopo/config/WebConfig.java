package com.bit.mopo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir; // ex) "uploads/"

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 실제 절대경로로 변환
        String fullPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .toUri()
                .toString();  // ex) file:///C:/project/uploads/

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fullPath);
    }
}

