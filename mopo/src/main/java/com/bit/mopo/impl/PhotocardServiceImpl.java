package com.bit.mopo.impl;

import com.bit.mopo.mapper.PhotocardMapper;
import com.bit.mopo.model.photocard.PhotocardDto;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.PhotocardService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@AllArgsConstructor
public class PhotocardServiceImpl implements PhotocardService {
    private final int PAGE_SIZE = 18;
    private PhotocardMapper photoCardMapper;

    @Override
    public int calculateMaxPage(String searchType, String searchKeyword) {
        Set<String> allowedSearch = Set.of(
                "name",
                "artist_name",
                "artist_type"
        );

        if (searchType != null && !allowedSearch.contains(searchType)) {
            searchType = null;
        }

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("searchType", searchType);
        paramMap.put("searchKeyword", searchKeyword);

        int totalCount = photoCardMapper.countRow(paramMap);

        return (totalCount + PAGE_SIZE - 1) / PAGE_SIZE;
    }

    @Override
    public List<PhotocardDto> selectAll(int pageNo, String sort,
                                        String dir,
                                        String searchType,
                                        String searchKeyword) {
        int startRow = (pageNo - 1) * PAGE_SIZE;

        // 화이트리스트 (리스트 값들만 허용)
        // ${}에 다른 sql문이 안들어가게끔 하기 위한 보안목적
        // 정렬은 인기순, 판매가격순, 포토카드이름순, pk값 순
        Set<String> allowedSort = Set.of(
                "id",
                "name",
                "sale_price",
                "view_count"
        );

        // 검색어는 포토카드이름, 아티스트이름, 아티스트타입 등으로 검색가능
        Set<String> allowedSearch = Set.of(
                "name",
                "artist_name",
                "artist_type"
        );

        // 허용된것 이외는 해당 값으로 처리하겠음.
        if (sort != null && !allowedSort.contains(sort)) {
            sort = "id";
        }

        if (searchType != null && !allowedSearch.contains(searchType)) {
            searchType = null;
        }

        if (dir == null || !(dir.equals("asc") || dir.equals("desc"))) {
            dir = "desc";
        }

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("startRow", startRow);
        paramMap.put("size", PAGE_SIZE);
        paramMap.put("sort", sort);
        paramMap.put("dir", dir);
        paramMap.put("searchType", searchType);
        paramMap.put("searchKeyword", searchKeyword);

        return photoCardMapper.selectAll(paramMap);
    }

    @Override
    public PhotocardDto selectOne(int id) {
        return photoCardMapper.selectOne(id);
    }

    @Override
    public void insert(PhotocardDto photocardDto) {
        int sellerId = SecurityUtil.getCurrentMemberId();
        photocardDto.setSellerId(sellerId);
        photoCardMapper.insert(photocardDto);
    }

    @Override
    public void update(PhotocardDto photocardDto) {
        photoCardMapper.update(photocardDto);
    }

    @Override
    public void increaseViewCount(int id) {
        photoCardMapper.increaseViewCount(id);
    }

    @Override
    public void updateStock(int id, int stock) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("stock", stock);

        photoCardMapper.updateStock(map);
    }

    @Override
    public void softDelete(int id) {
        photoCardMapper.softDelete(id);
    }

    @Override
    public void restore(int id) {
        photoCardMapper.restore(id);
    }

    @Override
    public void delete(int id) {
        photoCardMapper.delete(id);
    }

    @Override
    public List<PhotocardDto> showAllBySeller(int sellerId) {
        return photoCardMapper.showAllBySeller(sellerId);
    }
}
