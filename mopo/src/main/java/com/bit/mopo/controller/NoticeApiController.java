package com.bit.mopo.controller;

import com.bit.mopo.model.AdminResponse;
import com.bit.mopo.model.NoticeDto;
import com.bit.mopo.service.AdminNoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/notice/")
@RequiredArgsConstructor
public class NoticeApiController {
    private final AdminNoticeService adminNoticeService;

    // 공지사항 목록 조회 (페이징된 것)
    @GetMapping("showAll/{pageNo}")
    public AdminResponse showAll(@PathVariable int pageNo) {
        AdminResponse response = new AdminResponse();
        try {
            // Service 쪽에서 목록 + 페이징 정보를 Map으로 리턴하도록 설계
            Map<String, Object> data = adminNoticeService.selectAllNotice(pageNo);

            response.setResult("success");
            response.setMessage("공지사항 목록 조회 성공");
            response.setData(data);
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("fail");
            response.setMessage("공지사항 목록 조회 중 오류가 발생했습니다.");
        }
        return response;
    }

    // 공지사항 상세 조회
    @GetMapping("showOne/{noticeId}")
    public AdminResponse showOne(@PathVariable int noticeId) {
        AdminResponse response = new AdminResponse();
        try {
            NoticeDto notice = adminNoticeService.selectNoticeById(noticeId);

            if (notice == null) {
                response.setResult("fail");
                response.setMessage("해당 공지사항을 찾을 수 없습니다.");
                response.setData(null);
            } else {
                response.setResult("success");
                response.setMessage("공지사항 상세 조회 성공");
                response.setData(notice);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("fail");
            response.setMessage("공지사항 상세 조회 중 오류가 발생했습니다.");
            response.setData(null);
        }
        return response;
    }

    // 공지사항 등록
    @PostMapping("write")
    public AdminResponse write(@RequestBody NoticeDto noticeDto) {
        AdminResponse response = new AdminResponse();
        try {
            int result = adminNoticeService.insertNotice(noticeDto);

            if (result > 0) {
                Map<String, Object> data = new HashMap<>();
                data.put("noticeId", noticeDto.getId()); // insert 후 세팅된다고 가정

                response.setResult("success");
                response.setMessage("공지사항 등록 성공");
                response.setData(data);
            } else {
                response.setResult("fail");
                response.setMessage("공지사항 등록에 실패했습니다.");
                response.setData(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("fail");
            response.setMessage("공지사항 등록 중 오류가 발생했습니다.");
            response.setData(null);
        }
        return response;
    }

    // 공지사항 수정
    @PatchMapping("{noticeId}")
    public AdminResponse update(@PathVariable int noticeId,
                                @RequestBody NoticeDto noticeDto) {
        AdminResponse response = new AdminResponse();
        try {
            // PathVariable 로 받은 id 를 Dto에 넣어주기
            noticeDto.setId(noticeId);

            int result = adminNoticeService.updateNotice(noticeDto);

            if (result > 0) {
                response.setResult("success");
                response.setMessage("공지사항 수정 성공");
                response.setData(noticeDto);
            } else {
                response.setResult("fail");
                response.setMessage("공지사항 수정에 실패했습니다.");
                response.setData(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("fail");
            response.setMessage("공지사항 수정 중 오류가 발생했습니다.");
            response.setData(null);
        }
        return response;
    }

    // 공지사항 삭제
    @DeleteMapping("{noticeId}")
    public AdminResponse delete(@PathVariable int noticeId) {
        AdminResponse response = new AdminResponse();
        try {
            int result = adminNoticeService.deleteNotice(noticeId);

            if (result > 0) {
                response.setResult("success");
                response.setMessage("공지사항 삭제 성공");
                response.setData(null);
            } else {
                response.setResult("fail");
                response.setMessage("공지사항 삭제에 실패했습니다.");
                response.setData(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("fail");
            response.setMessage("공지사항 삭제 중 오류가 발생했습니다.");
            response.setData(null);
        }
        return response;
    }

    // 중요 공지 상단 고정 (핀 고정)
    @PatchMapping("pin/{noticeId}")
    public AdminResponse pin(@PathVariable int noticeId) {
        AdminResponse response = new AdminResponse();
        try {
            int result = adminNoticeService.pinNotice(noticeId);

            if (result > 0) {
                response.setResult("success");
                response.setMessage("공지사항을 상단에 고정했습니다.");
                response.setData(null);
            } else {
                response.setResult("fail");
                response.setMessage("공지사항 상단 고정에 실패했습니다.");
                response.setData(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("fail");
            response.setMessage("공지사항 상단 고정 중 오류가 발생했습니다.");
            response.setData(null);
        }
        return response;
    }

    // 중요 공지 상단 고정 (핀 고정)
    @PatchMapping("unpin/{noticeId}")
    public AdminResponse unpin(@PathVariable int noticeId) {
        AdminResponse response = new AdminResponse();
        try {
            int result = adminNoticeService.unpinNotice(noticeId);

            if (result > 0) {
                response.setResult("success");
                response.setMessage("공지사항을 상단에서 고정해제 했습니다.");
                response.setData(null);
            } else {
                response.setResult("fail");
                response.setMessage("공지사항 상단 고정해제에 실패했습니다.");
                response.setData(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("fail");
            response.setMessage("공지사항 상단 고정 중 오류가 발생했습니다.");
            response.setData(null);
        }
        return response;
    }
}

