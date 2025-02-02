package com.example.IdentityService.response;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum ResponseCode {

    Authenticated(1000, "Your token is right", HttpStatus.ACCEPTED);

    private int code;
    private String message;
    private HttpStatus status;

    public static Map<String, Object> jsonForEnum(ResponseCode responseCode) {
        Map<String, Object> map = new HashMap<>();
        map.put("Code", responseCode.getCode());
        map.put("Message", responseCode.getMessage());
        return map;
    }
}
