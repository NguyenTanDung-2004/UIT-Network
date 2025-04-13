package com.example.ChatService.enums;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EnumDisplayType {
    DISPLAY(1, "Display", "Display"),
    HIDE(2, "Hide", "Hide"),;

    private final int id;
    private final String typeName;
    private final String value;

    // Static lookup map for quick retrieval
    private static final Map<Integer, EnumDisplayType> TYPE_MAP = Stream.of(values())
            .collect(Collectors.toMap(EnumDisplayType::getId, e -> e));

    public static EnumDisplayType fromTypeId(int typeId) {
        return TYPE_MAP.get(typeId);
    }

    public static Map<String, Object> toMap(EnumDisplayType enumPostType) {
        return Map.of("id", enumPostType.getId(), "typeName", enumPostType.getTypeName(), "value",
                enumPostType.getValue());
    }

    public static String getType(int typeId) {
        return fromTypeId(typeId).getTypeName();
    }
}
