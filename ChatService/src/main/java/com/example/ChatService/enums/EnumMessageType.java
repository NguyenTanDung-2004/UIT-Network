package com.example.ChatService.enums;



import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EnumMessageType {
    TEXT(1, "text", "Text message"),
    IMAGE(2, "image", "Image message"),
    REPLY(3, "reply", "Reply message"),
    FILE(4, "file", "File message");

    private final int id;
    private final String typeName;
    private final String value;

    // Static lookup map for quick retrieval
    private static final Map<Integer, EnumMessageType> TYPE_MAP = Stream.of(values())
            .collect(Collectors.toMap(EnumMessageType::getId, e -> e));

    public static EnumMessageType fromTypeId(int typeId) {
        return TYPE_MAP.get(typeId);
    }

    public static Map<String, Object> toMap(EnumMessageType enumPostType) {
        return Map.of("id", enumPostType.getId(), "typeName", enumPostType.getTypeName(), "value",
                enumPostType.getValue());
    }

    public static String getType(int typeId) {
        return fromTypeId(typeId).getTypeName();
    }
}
