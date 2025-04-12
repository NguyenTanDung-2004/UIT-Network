package com.example.ChatService.response;

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
    CREATE_MESSAGE_SUCCESS("s_01_chat", "Create message success", HttpStatus.OK),
    CREATE_GROUP_SUCCESS("s_02_chat", "Create group success", HttpStatus.OK),
    ADD_MEMBER_SUCCESS("s_03_chat", "Add member success", HttpStatus.OK), 
    REMOVE_MEMBER_SUCCESS("s_04_chat", "Remove member success", HttpStatus.OK), 
    CHECK_USER_GROUP_SUCCESS("s_05_chat", "Check user group success", HttpStatus.OK), 
    SEEN_MESSAGE_SUCCESS("s_06_chat", "Seen message success", HttpStatus.OK),;
    String code;
    String message;
    HttpStatusCode httpStatus;

    public static Map<String, Object> toJson(EnumResponse enumResponse) {
        return Map.of("code", enumResponse.getCode(), "message", enumResponse.getMessage());
    }
}
