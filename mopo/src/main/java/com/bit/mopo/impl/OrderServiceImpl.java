package com.bit.mopo.impl;

import com.bit.mopo.mapper.OrderItemMapper;
import com.bit.mopo.mapper.OrderMapper;
import com.bit.mopo.model.order.OrderDto;
import com.bit.mopo.model.order.OrderItemDto;
import com.bit.mopo.model.order.OrderSellerResponse;
import com.bit.mopo.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {
    private OrderMapper orderMapper;
    private OrderItemMapper orderItemMapper;

    // In the event of a midterm failure, the whole thing will be rolled back
    @Transactional(readOnly = true)
    @Override
    public List<OrderDto> selectByMemberId(int memberId) {
        List<OrderDto> orders = orderMapper.selectByMemberId(memberId);

        // orderItems List(order.id) -> order's item
        for(OrderDto order : orders){
            List<OrderItemDto> items = orderItemMapper.selectByOrderId(order.getId());
            order.setItems(items);
        }

        return orders;
    }

    @Override
    public List<OrderItemDto> selectByOrderId(int orderId) {
        return orderItemMapper.selectByOrderId(orderId);
    }

    @Override
    public List<OrderSellerResponse> selectBySellerId(int sellerId) {
        return orderItemMapper.selectBySellerId(sellerId);
    }

    @Override
    public void insert(OrderDto orderDto) {
        // Order insert
        String orderNumber = "ORD-" + System.currentTimeMillis();
        orderDto.setOrderNumber(orderNumber);
        orderMapper.insert(orderDto);
        // now, orderDto.id is created auto by db

        // OrderItem insert
        for(OrderItemDto item : orderDto.getItems()) {
            item.setOrderId(orderDto.getId()); // FK setting
            orderItemMapper.insert(item);
        }
    }

    @Override
    public void update(OrderDto orderDto) {
        // todo
//        orderMapper.update(orderDto);
    }

    @Override
    public void delete(int id) {
        // todo
//        orderMapper.delete(id);
    }
}
