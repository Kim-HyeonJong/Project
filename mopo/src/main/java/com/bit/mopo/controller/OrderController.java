package com.bit.mopo.controller;

import com.bit.mopo.model.order.OrderDto;
import com.bit.mopo.model.order.OrderItemDto;
import com.bit.mopo.model.order.OrderSellerResponse;
import com.bit.mopo.security.SecurityUtil;
import com.bit.mopo.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/order/")
public class OrderController {
    private OrderService orderService;

    // from order table
    @GetMapping("member")
    public Map<String, Object> showAllByMember() {
        int memberId = SecurityUtil.getCurrentMemberId();
        Map<String, Object> map = new HashMap<>();
        try {
            List<OrderDto> orderList = orderService.selectByMemberId(memberId);
            map.put("result", "success");
            map.put("data", orderList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    // return order_item list select by orderId;
    // request by "USER"
    // 주문 상세를 클릭했을때
    @GetMapping("showOne/{orderId}")
    public Map<String, Object> showOne(@PathVariable int orderId) {
        Map<String, Object> map = new HashMap<>();
        try {
            List<OrderItemDto> orderItemList = orderService.selectByOrderId(orderId);
            map.put("result", "success");
            map.put("data", orderItemList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    // from order_item table
    @GetMapping("seller")
    public Map<String, Object> showAllBySeller() {
        int sellerId = SecurityUtil.getCurrentMemberId();
        Map<String, Object> map = new HashMap<>();
        try {
            List<OrderSellerResponse> orderItemList = orderService.selectBySellerId(sellerId);
            map.put("result", "success");
            map.put("data", orderItemList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    @PostMapping("submit")
    public Map<String, Object> submit(@RequestBody OrderDto orderDto) {
        Map<String, Object> map = new HashMap<>();
        int memberId = SecurityUtil.getCurrentMemberId();
        try {
            orderDto.setMemberId(memberId);
            orderService.insert(orderDto);
            map.put("result", "success");
            map.put("data", orderDto);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    // not used (extend)
    @PatchMapping("")
    public Map<String, Object> update(@RequestBody OrderDto orderDto) {
        Map<String, Object> map = new HashMap<>();
        try {
            orderService.update(orderDto);
            map.put("result", "success");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }

    // not used (extend)
    @DeleteMapping("{id}")
    public Map<String, Object> delete(@PathVariable int id) {
        Map<String, Object> map = new HashMap<>();
        try {
            orderService.delete(id);
            map.put("result", "success");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", "fail");
            map.put("message", e.getMessage());
        }
        return map;
    }
}
