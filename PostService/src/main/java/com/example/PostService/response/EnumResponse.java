package com.example.PostService.response;

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
    CREATE_POST_SUCCESS("s_01_post", "Create post successfully!", HttpStatus.OK),
    UPDATE_POST_SUCCESS("s_02_post", "Update post successfully!", HttpStatus.OK),
    DELETE_POST_SUCCESS("s_03_post", "Delete post successfully!", HttpStatus.OK),
    LIKE_POST_SUCCESS("s_04_post", "Like post successfully!", HttpStatus.OK),
    COMMENT_POST_SUCCESS("s_05_post", "Comment post successfully!", HttpStatus.OK),
    UPDATE_COMMENT_SUCCESS("s_06_post", "Update comment successfully!", HttpStatus.OK),
    DELETE_COMMENT_SUCCESS("s_07_post", "Delete comment successfully!", HttpStatus.OK),
    LIKE_COMMENT_SUCCESS("s_08_post", "Like comment successfully!", HttpStatus.OK),
    GET_POST_DETAIL_SUCCESS("s_09_post", "Get post detail successfully!", HttpStatus.OK),
    GET_POST_IN_HOME_SUCCESS("s_10_post", "Get post in home successfully!", HttpStatus.OK), 
    GET_LIST_COMMENT_SUCCESS("s_11_post", "Get list comment successfully!", HttpStatus.OK),
    GET_LIST_USER_POST_SUCCESS("s_12_post", "Get list user's post successfully!", HttpStatus.OK),
    GET_LIST_FANPAGE_POST_SUCCESS("s_13_post", "Get list fanpage's post successfully!", HttpStatus.OK),
    GET_LIST_GROUP_POST_SUCCESS("s_14_post", "Get list group's post successfully!", HttpStatus.OK),;
    String code;
    String message;
    HttpStatusCode httpStatus;

    public static Map<String, Object> toJson(EnumResponse enumResponse) {
        return Map.of("code", enumResponse.getCode(), "message", enumResponse.getMessage());
    }
}
