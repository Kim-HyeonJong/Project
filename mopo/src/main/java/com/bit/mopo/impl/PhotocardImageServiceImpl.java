package com.bit.mopo.impl;

import com.bit.mopo.config.FileStorageProperties;
import com.bit.mopo.mapper.PhotocardImageMapper;
import com.bit.mopo.model.photocard.PhotocardImageDto;
import com.bit.mopo.service.PhotoCardImageService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotocardImageServiceImpl implements PhotoCardImageService {
    private final PhotocardImageMapper photocardImageMapper;
    private final FileStorageProperties fileStorageProperties;
    @Override
    public void deleteByPhotocardId(int photocardId) {
        photocardImageMapper.deleteByPhotocardId(photocardId);
    }

    @Override
    public void insert(PhotocardImageDto image) {
        photocardImageMapper.insert(image);
    }


    @Value("${file.upload-dir}")
    private String uploadRoot; // uploads/

    // 임시 업로드 저장
    public String saveTempFile(MultipartFile file) throws Exception {
        String uuid = UUID.randomUUID().toString() + ".jpg";

        Path tempPath = Paths.get(uploadRoot, "temp");
        Files.createDirectories(tempPath); // 폴더 없으면 생성

        Path savePath = tempPath.resolve(uuid);

        // 이미지 리사이즈 + JPG 변환
        Thumbnails.of(file.getInputStream())
                .size(800, 800)
                .outputFormat("jpg")
                .toFile(savePath.toFile());

        return uuid; // 프론트로 uuid 전달
    }

    // temp → photocard 이동
    public String moveToPhotocard(String tempFileName) throws Exception {
        String root = fileStorageProperties.getUploadDir();

        Path temp = Paths.get(root, "temp", tempFileName);
        Path photocardDir = Paths.get(root, "photocard");
        Files.createDirectories(photocardDir);

        String newName = UUID.randomUUID().toString() + ".jpg";
        Path target = photocardDir.resolve(newName);

        Files.move(temp, target);

        return newName;
    }

    @Override
    public PhotocardImageDto selectByPhotocardId(int photocardId) {
        return photocardImageMapper.selectByPhotocardId(photocardId);
    }

    @Override
    public void updateImageUrl(PhotocardImageDto photocardImageDto) {
        photocardImageMapper.updateImageUrl(photocardImageDto);
    }
}
