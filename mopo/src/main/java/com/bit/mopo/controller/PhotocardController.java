package com.bit.mopo.controller;

import com.bit.mopo.model.photocard.PhotocardDto;
import com.bit.mopo.model.photocard.PhotocardImageDto;
import com.bit.mopo.model.photocard.PhotocardResponse;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.PhotoCardImageService;
import com.bit.mopo.service.PhotocardService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/photocard/")
@AllArgsConstructor
public class PhotocardController {
    private PhotocardService photoCardService;
    private PhotoCardImageService photoCardImageService;

    /*
     * sort : id, view_count, sale_price,  ...
     * dir : asc, desc
     * searchType : artist_type, agency_name(extend)
     * searchKeyword : artist_name
     * */
    @GetMapping("showAll/{pageNo}")
    public PhotocardResponse showAll(
            @PathVariable int pageNo,
            // 추가 해봄
            @RequestParam(defaultValue = "2") int limit,

            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchKeyword
    ) {
        // response : PhotocardDto, pagination fields, sort fields
        PhotocardResponse response = new PhotocardResponse();

        // for pagination
        int totalPage = photoCardService.calculateMaxPage(searchType, searchKeyword);
        response.setTotalPage(totalPage);
        response.setCurrentPage(pageNo);
        int startPage = pageNo - 2;
        int endPage = pageNo + 2;

        if (startPage < 1) {
            startPage = 1;
            endPage = Math.min(5, totalPage);
        }

        if (endPage > totalPage) {
            endPage = totalPage;
            startPage = Math.max(1, totalPage - 4);
        }
        response.setStartPage(startPage);
        response.setEndPage(endPage);

        // for sort
        response.setDir(dir);
        response.setSearchType(searchType);
        response.setSearchKeyword(searchKeyword);
        response.setSort(sort);

        // get List valid pageNo, sort
        response.setItems(photoCardService.selectAll(pageNo,
                sort,
                dir,
                searchType,
                searchKeyword));
        return response;
    }

    @GetMapping("showOne/{id}")
    public PhotocardDto showOne(@PathVariable int id) {
        return photoCardService.selectOne(id);
    }

    @GetMapping("showAllBySeller")
    public Map<String, Object> showAllBySeller() {
        Map<String, Object> map = new HashMap<>();
        int sellerId = SecurityUtil.getCurrentMemberId();
        try {
            List<PhotocardDto> photocardDtoList = photoCardService.showAllBySeller(sellerId);
            map.put("result", "success");
            map.put("data", photocardDtoList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    @PostMapping("write")
    public Map<String, Object> write(@RequestBody PhotocardDto photocardDto) {
        Map<String, Object> map = new HashMap<>();
        int sellerId = SecurityUtil.getCurrentMemberId();
        try {
            photocardDto.setSellerId(sellerId);
            photoCardService.insert(photocardDto);

            // 이미지 이동
            String newName = photoCardImageService.moveToPhotocard(photocardDto.getTempFileName());
            String imageUrl = "/uploads/photocard/" + newName;

            // 이미지 DB 저장
            PhotocardImageDto img = new PhotocardImageDto();
            img.setPhotocardId(photocardDto.getId());
            img.setImageUrl(imageUrl);
            img.setSortOrder(1);

            photoCardImageService.insert(img);


            map.put("result", "success");
            map.put("data", photocardDto);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    @PatchMapping
    public Map<String, Object> update(@RequestBody PhotocardDto photocardDto) {
        Map<String, Object> map = new HashMap<>();
        try {
            photoCardService.update(photocardDto);

            if (!photocardDto.getTempFileName().isBlank()) {
                String newName = photoCardImageService.moveToPhotocard(photocardDto.getTempFileName());
                String imageUrl = "/uploads/photocard/" + newName;

                PhotocardImageDto img = photoCardImageService.selectByPhotocardId(photocardDto.getId());
                img.setImageUrl(imageUrl);

                photoCardImageService.updateImageUrl(img);
            }

            map.put("result", "success");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }

        return map;
    }

    @PatchMapping("{id}/view")
    public Map<String, Object> increaseView(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();

        try {
            photoCardService.increaseViewCount(id);

            map.put("result", "success");
            map.put("message", "조회수 증가 완료");
            map.put("photocardId", id);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }

        return map;
    }

    @PatchMapping("{id}/stock")
    public Map<String, Object> updateStock(
            @PathVariable int id,
            @RequestParam(required = false) Integer stock,      // 셀러 임의 수정
            @RequestParam(required = false) Integer quantity   // 결제 차감
    ) {
        Map<String, Object> map = new HashMap<>();

        try {
            PhotocardDto photocard = photoCardService.selectOne(id);

            if (stock != null) {
                photoCardService.updateStock(id, stock);
            } else if (quantity != null) {
                // 결제에 따른 재고 차감
                if (photocard.getStock() < quantity) throw new RuntimeException("재고 부족");
                photoCardService.updateStock(id, photocard.getStock() - quantity);
            } else {
                throw new RuntimeException("stock 또는 quantity 중 하나는 반드시 필요합니다.");
            }

            map.put("result", "success");
            map.put("message", "재고 수정 완료");
            map.put("photocardId", id);
            map.put("stock", photocard.getStock());
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }

        return map;
    }

    @PatchMapping("{id}/delete")
    public Map<String, Object> softDelete(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();

        try {
            photoCardService.softDelete(id);

            map.put("result", "success");
            map.put("message", "삭제 처리 완료");
            map.put("photocardId", id);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }

        return map;
    }

    @PatchMapping("{id}/restore")
    public Map<String, Object> restore(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();

        try {
            photoCardService.restore(id);

            map.put("result", "success");
            map.put("message", "복구 처리 완료");
            map.put("photocardId", id);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }

        return map;
    }

    @DeleteMapping("{id}")
    public Map<String, Object> delete(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        try {
            photoCardService.delete(id);
            map.put("result", "success");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    @PostMapping("image/upload-temp")
    public Map<String, Object> uploadTemp(@RequestParam("file") MultipartFile file) {
        Map<String, Object> map = new HashMap<>();
        try {
            String name = photoCardImageService.saveTempFile(file);

            map.put("result", "success");
            map.put("tempFileName", name);      // 프론트에서 유지
            map.put("imageUrl", "/uploads/temp/" + name);

        } catch (Exception e) {
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }
}
