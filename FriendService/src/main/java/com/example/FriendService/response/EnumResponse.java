package com.example.FriendService.response;

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
    REQUEST_TO_ADDFRIEND("s_01_friend", "Request to add friend successfully!", HttpStatus.OK),
    CANCEL_REQUEST_ADDFRIEND("s_02_friend", "Cancel request to add friend successfully!", HttpStatus.OK),
    ACCEPT_REQUEST_ADDFRIEND("s_03_friend", "Accept friend successfully!", HttpStatus.OK),
    REMOVE_REQUEST_ADDFRIEND("s_04_friend", "Remove friend successfully!", HttpStatus.OK);

    String code;
    String message;
    HttpStatusCode httpStatus;

    public static Map<String, Object> toJson(EnumResponse enumResponse) {
        return Map.of("code", enumResponse.getCode(), "message", enumResponse.getMessage());
    }
}
