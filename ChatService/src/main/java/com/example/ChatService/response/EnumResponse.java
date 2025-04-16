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
    SEEN_MESSAGE_SUCCESS("s_06_chat", "Seen message success", HttpStatus.OK), 
    GET_LIST_GROUP_SUCCESS("s_07_chat", "Get list group success", HttpStatus.OK), 
    GET_MESSAGE_SUCCESS("s_08_chat", "Get message success", HttpStatus.OK),
    
    CREATE_WORKSHEET_SUCCESS("s_09_chat", "Create worksheet success", HttpStatus.OK), 
    
    UPDATE_WORKSHEET_SUCCESS("s_10_chat", "Update worksheet success", HttpStatus.OK), 
    GET_WORKSHEET_SUCCESS("s_11_chat", "Get worksheet success", HttpStatus.OK);
    String code;
    String message;
    HttpStatusCode httpStatus;

    public static Map<String, Object> toJson(EnumResponse enumResponse) {
        return Map.of("code", enumResponse.getCode(), "message", enumResponse.getMessage());
    }
}
