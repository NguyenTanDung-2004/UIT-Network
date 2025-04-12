package com.example.ChatService.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EnumStatus {
    ACTIVE(1, "ACTIVE", "ACTIVE"),;

    private Integer id;
    private String value;
    private String description;
}
