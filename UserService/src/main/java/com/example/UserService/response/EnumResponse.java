package com.example.UserService.response;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum EnumResponse {
    CREATE_USER_SUCCESS("s_01", "Create user successfully", HttpStatus.OK),
    LOGIN_SUCCESS("s_02", "Login successfully", HttpStatus.OK),
    SEND_CODE_FORGOT_PASSWORD_SUCCESS("s_03", "Send code forgot password successfully", HttpStatus.OK);

    String code;
    String message;
    HttpStatusCode httpStatus;

    public static Map<String, Object> toJson(EnumResponse enumResponse) {
        return Map.of("code", enumResponse.getCode(), "message", enumResponse.getMessage());
    }
}
