package com.bit.mopo.mapper;

import com.bit.mopo.model.photocard.PhotocardDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface PhotocardMapper {

    int countRow(Map<String, Object> paramMap);

    List<PhotocardDto> selectAll(Map<String, Object> paramMap);

    void delete(int id);

    void update(PhotocardDto photocardDto);

    void increaseViewCount(int id);

    void updateStock(Map<String, Object> map);

    void softDelete(int id);

    void restore(int id);

    void insert(PhotocardDto photocardDto);

    PhotocardDto selectOne(int id);

    List<PhotocardDto> showAllBySeller(int sellerId);
}
