package com.bit.mopo.model.photocard;

import lombok.Data;

import java.util.List;

@Data
public class PhotocardResponse {
    private List<PhotocardDto> items;
    private int currentPage;
    private int startPage;
    private int endPage;
    private int totalPage;
    private String sort;
    private String dir;
    private String searchType;
    private String searchKeyword;
}
