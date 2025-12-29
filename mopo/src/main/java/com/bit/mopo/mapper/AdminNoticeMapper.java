package com.bit.mopo.mapper;

import com.bit.mopo.model.NoticeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminNoticeMapper {

    List<NoticeDto> selectAll(Map<String, Integer> paramMap);

    int countRows();

    NoticeDto selectOne(int id);

    int insert(NoticeDto noticeDto);

    int update(NoticeDto noticeDto);

    int delete(int id);

    int updatePinned(@Param("id") int id,
                     @Param("pinnedFlag") char pinned);
}
