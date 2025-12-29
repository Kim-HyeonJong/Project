package com.bit.mopo.model;

import lombok.Data;

@Data
public class AdminResponse {
    /*private int id;
    private String nickname;
    private String email;
    private String role;*/
    private String result; // 완료 / 에러
    private String message; // 설명 메시지
    private Object data;


    public AdminResponse() {

    } // new로 생성해야 한다.


    public static AdminResponse success(Object data) {
        AdminResponse resp = new AdminResponse();
        resp.setResult("success");
        resp.setMessage(null);
        resp.setData(data);
        return resp;
    }

    public static AdminResponse fail(String message) {
        AdminResponse resp = new AdminResponse();
        resp.setResult("fail");
        resp.setMessage(message);
        resp.setData(null);
        return resp;
    }
}
