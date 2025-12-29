package com.bit.mopo.service;

import com.bit.mopo.model.order.OrderDto;
import com.bit.mopo.model.order.OrderItemDto;
import com.bit.mopo.model.order.OrderSellerResponse;

import java.util.List;

public interface OrderService {
    List<OrderDto> selectByMemberId(int memberId);

    List<OrderItemDto> selectByOrderId(int orderId);

    List<OrderSellerResponse> selectBySellerId(int sellerId);

    void insert(OrderDto orderDto);

    void update(OrderDto orderDto);

    void delete(int id);
}
