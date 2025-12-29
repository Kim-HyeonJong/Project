package com.bit.mopo.mapper;

import com.bit.mopo.model.order.OrderItemDto;
import com.bit.mopo.model.order.OrderSellerResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderItemMapper {
    List<OrderItemDto> selectByOrderId(int id);

    List<OrderSellerResponse> selectBySellerId(int id);

    void insert(OrderItemDto item);
}
