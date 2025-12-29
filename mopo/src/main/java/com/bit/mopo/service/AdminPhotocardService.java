package com.bit.mopo.service;

import com.bit.mopo.model.photocard.PhotocardDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminPhotocardService {
    // 전체 포토카드 목록 조회
    public static int selectAll(int pageNo) {
        return selectAll(pageNo);
    }

    public PhotocardDto selectByPhotocardId(int photocardId);

    public void update(int photocardId);


    List<PhotocardDto> selectAll(String artist, String member, String sellerName, String saleStatus);

    void updateHidden(int photocardId);

    void delete(int photocardId);
}
