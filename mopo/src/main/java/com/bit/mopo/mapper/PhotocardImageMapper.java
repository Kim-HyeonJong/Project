package com.bit.mopo.mapper;

import com.bit.mopo.model.photocard.PhotocardImageDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PhotocardImageMapper {
    void deleteByPhotocardId(int photocardId);

    void insert(PhotocardImageDto image);

    PhotocardImageDto selectByPhotocardId(int photocardId);

    void updateImageUrl(PhotocardImageDto photocardImageDto);
}
