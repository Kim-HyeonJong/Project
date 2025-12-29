package com.bit.mopo.mapper;

import com.bit.mopo.model.order.OrderDto;
import com.bit.mopo.model.order.OrderItemDto;
import com.bit.mopo.model.order.OrderSellerResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMapper {
    List<OrderDto> selectByMemberId(int memberId);

    List<OrderItemDto> selectByOrderId(int orderId);

    List<OrderSellerResponse> selectBySellerId(int sellerId);

    void insert(OrderDto orderDto);

    void update(OrderDto orderDto);

    void delete(int id);
}
