package com.bit.mopo.service;

import com.bit.mopo.model.photocard.PhotocardImageDto;
import org.springframework.web.multipart.MultipartFile;

public interface PhotoCardImageService {
    void deleteByPhotocardId(int photocardId);

    void insert(PhotocardImageDto image);

    String saveTempFile(MultipartFile file) throws Exception;

    String moveToPhotocard(String tempFileName) throws Exception;

    PhotocardImageDto selectByPhotocardId(int photocardId);

    void updateImageUrl(PhotocardImageDto photocardImageDto);
}
