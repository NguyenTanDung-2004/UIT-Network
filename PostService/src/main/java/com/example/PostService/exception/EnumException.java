package com.example.PostService.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import com.example.PostService.response.EnumResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum EnumException {
    INTERNAL_ERROR("f_01_post", "Internal Error", HttpStatus.INTERNAL_SERVER_ERROR),
    POST_NOT_FOUND("f_02_post", "Post is not existed", HttpStatus.BAD_REQUEST);

    String code;
    String message;
    HttpStatusCode httpStatusCode;

    public static Map<String, Object> toJson(EnumException enumException) {
        return Map.of("code", enumException.getCode(), "message", enumException.getMessage());
    }
}
