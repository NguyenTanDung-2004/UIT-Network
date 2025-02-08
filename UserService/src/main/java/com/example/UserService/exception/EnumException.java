package com.example.UserService.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import com.example.UserService.response.EnumResponse;

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
    VERIFY_TOKEN_FAIL("f_01", "Verify Token Fail", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("f_02", "User Not Found", HttpStatus.BAD_REQUEST),
    CODE_RESETPASS_WRONG("f_03", "Code is wrong", HttpStatus.BAD_REQUEST),
    JSON_OBJECT_FAIL("f_04", "Convert json to object fail", HttpStatus.INTERNAL_SERVER_ERROR),
    OBJECT_JSON_FAIL("f_05", "Convert object to json fail", HttpStatus.INTERNAL_SERVER_ERROR);

    String code;
    String message;
    HttpStatusCode httpStatusCode;

    public static Map<String, Object> toJson(EnumException enumException) {
        return Map.of("code", enumException.getCode(), "message", enumException.getMessage());
    }
}
