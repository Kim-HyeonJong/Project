package com.bit.mopo.service;

import com.bit.mopo.model.photocard.PhotocardDto;

import java.util.List;

public interface PhotocardService {

    int calculateMaxPage(String searchType, String searchKeyword);

    List<PhotocardDto> selectAll(int pageNo, String sort,
                                 String dir,
                                 String searchType,
                                 String searchKeyword);

    PhotocardDto selectOne(int id);

    void insert(PhotocardDto photocardDto);

    void update(PhotocardDto photocardDto);

    // 조회수 1 증가
    void increaseViewCount(int id);

    // 재고 변경
    void updateStock(int id, int stock);

    // soft delete
    void softDelete(int id);

    // restore
    void restore(int id);

    void delete(int id);

    List<PhotocardDto> showAllBySeller(int sellerId);
}
