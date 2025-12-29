package com.bit.mopo.service;

import com.bit.mopo.model.NoticeDto;

import java.util.Map;

public interface AdminNoticeService {

    // 공지 목록 (페이징 정보까지 Map으로 반환)
    Map<String, Object> selectAllNotice(int pageNo);

    // 상세 공지
    NoticeDto selectNoticeById(int noticeId);

    // 등록
    int insertNotice(NoticeDto noticeDto);

    // 수정
    int updateNotice(NoticeDto noticeDto);

    // 삭제
    int deleteNotice(int noticeId);

    // 중요 공지사항 상단 고정
    int pinNotice(int noticeId);

    // 중요 공지사항 상단 고정 해제(Controller에는 사용 안해놓음)
    int unpinNotice(int noticeId);
}
