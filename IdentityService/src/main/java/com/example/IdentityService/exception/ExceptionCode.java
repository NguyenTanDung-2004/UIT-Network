package com.example.IdentityService.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ExceptionCode {
    CreateTokenFail("Create token fail", 1001, HttpStatus.CONFLICT),
    VerifyTokenFail("Verify token fail", 1001, HttpStatus.CONFLICT);

    private String message;
    private int code;
    private HttpStatus status;

    public static Map<String, Object> jsonForEnum(ExceptionCode exceptionCode) {
        Map<String, Object> map = new HashMap<>();
        map.put("Code", exceptionCode.getCode());
        map.put("Message", exceptionCode.getStatus());
        return map;
    }
}
