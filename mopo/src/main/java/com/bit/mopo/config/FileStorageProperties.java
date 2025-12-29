package com.bit.mopo.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@ConfigurationProperties(prefix = "file")
@Data
public class FileStorageProperties {

    private String uploadDir;

    @PostConstruct
    public void init() {
        // 상대 경로면 프로젝트 기준 절대경로로 변경
        Path path = Paths.get(uploadDir).toAbsolutePath().normalize();
        uploadDir = path.toString();

        System.out.println("UPLOAD_DIR = " + uploadDir);
    }
}
