package com.example.FanpageGroupService.response;

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
    CREATE_FANPAGE_SUCCESS("s_01_fanpagegroup", "Create fanpage successfully!", HttpStatus.OK),
    DELETE_FANPAGE_SUCCESS("s_02_fanpagegroup", "Delete fanpage successfully!", HttpStatus.OK),
    UPDATE_FANPAGE_SUCCESS("s_03_fanpagegroup", "Update fanpage successfully!", HttpStatus.OK),
    CREATE_GROUP_SUCCESS("s_04_fanpagegroup", "Create group successfully!", HttpStatus.OK),
    UPDATE_GROUP_SUCCESS("s_05_fanpagegroup", "Update group successfully!", HttpStatus.OK),
    DELETE_GROUP_SUCCESS("s_06_fanpagegroup", "Delete fanpage successfully!", HttpStatus.OK),
    RQEUEST_JOINGROUP_SUCCESS("s_07_fanpagegroup", "Request join group successfully!", HttpStatus.OK),
    GET_REQUESTJOINGROUP_SUCCESS("s_08_fanpagegroup", "Get request join group successfully!", HttpStatus.OK),
    ACCEPT_REQUESTJOINGROUP_SUCCESS("s_09_fanpagegroup", "Accept request join group successfully!", HttpStatus.OK),
    REMOVE_REQUESTJOINGROUP_SUCCESS("s_010_fanpagegroup", "Remove request join group successfully!", HttpStatus.OK);

    String code;
    String message;
    HttpStatusCode httpStatus;

    public static Map<String, Object> toJson(EnumResponse enumResponse) {
        return Map.of("code", enumResponse.getCode(), "message", enumResponse.getMessage());
    }
}
