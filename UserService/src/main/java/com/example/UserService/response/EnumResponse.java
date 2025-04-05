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
    SEND_CODE_FORGOT_PASSWORD_SUCCESS("s_03", "Send code forgot password successfully", HttpStatus.OK),
    RESET_PASSWORD_SUCCESS("s_04", "Reset password successfully!", HttpStatus.OK),
    GET_USERINFO_SUCCESS("s_05", "Get user info successfully!", HttpStatus.OK),
    UPDATE_BASIC_USERINFO("s_06", "Update user info successfully!", HttpStatus.OK),
    UPDATE_USER_HOBBIES("s_07", "Update user hobbies successfully!", HttpStatus.OK),
    SEARCH_USER_SUCCESS("s_08", "Search user successfully!", HttpStatus.OK),;

    String code;
    String message;
    HttpStatusCode httpStatus;

    public static Map<String, Object> toJson(EnumResponse enumResponse) {
        return Map.of("code", enumResponse.getCode(), "message", enumResponse.getMessage());
    }
}
