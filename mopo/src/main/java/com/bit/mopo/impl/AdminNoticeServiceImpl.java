package com.bit.mopo.impl;

import com.bit.mopo.mapper.AdminNoticeMapper;
import com.bit.mopo.model.NoticeDto;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.AdminNoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminNoticeServiceImpl implements AdminNoticeService {

    private final AdminNoticeMapper adminNoticeMapper;

    // 페이지네이션을 1부터 10 페이지까지 오게끔 한다.
    private static final int PAGE_SIZE = 10;

    @Override
    public Map<String, Object> selectAllNotice(int pageNo) {
        // 페이지 계산
        int offset = (pageNo - 1) * PAGE_SIZE;

        Map<String, Integer> paramMap = new HashMap<>();
        paramMap.put("offset", offset);
        paramMap.put("limit", PAGE_SIZE);

        List<NoticeDto> list = adminNoticeMapper.selectAll(paramMap);
        adminNoticeMapper.countRows();

        int totalCount = adminNoticeMapper.countRows();

        int totalPage = (int) Math.ceil((double) totalCount / PAGE_SIZE);

        int pageBlock = 10; // 페이지 블럭 크기
        int startPage = ((pageNo - 1) / pageBlock) * pageBlock + 1;
        int endPage = Math.min(startPage + pageBlock - 1, totalPage);

        Map<String, Object> data = new HashMap<>();
        data.put("items", list);
        data.put("totalCount", totalCount);
        data.put("totalPage", totalPage);
        data.put("currentPage", pageNo);
        data.put("startPage", startPage);
        data.put("endPage", endPage);

        return data;
    }

    // 여기 하위의 모든 @Override는, Service -> Mapper 그대로 위임하는 구조이다.
    @Override
    public NoticeDto selectNoticeById(int noticeId) {
        return adminNoticeMapper.selectOne(noticeId);
    }

    @Override
    public int insertNotice(NoticeDto noticeDto) {
        noticeDto.setAdminId(SecurityUtil.getCurrentMemberId());
        return adminNoticeMapper.insert(noticeDto);
    }

    @Override
    public int updateNotice(NoticeDto noticeDto) {
        return adminNoticeMapper.update(noticeDto);
    }

    @Override
    public int deleteNotice(int noticeId) {
        return adminNoticeMapper.delete(noticeId);
    }

    @Override
    public int pinNotice(int noticeId) {
        return adminNoticeMapper.updatePinned(noticeId, 'Y');
    }

    @Override
    public int unpinNotice(int noticeId) {
        return adminNoticeMapper.updatePinned(noticeId, 'N');
    }
}
