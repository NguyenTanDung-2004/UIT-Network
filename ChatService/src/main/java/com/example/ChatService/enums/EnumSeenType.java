package com.example.ChatService.enums;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Getter;
@Getter
@AllArgsConstructor
public enum EnumSeenType {
    SEEN(1, "Seen", "Seen"),
    UNSEEN(2, "Unseen", "Unseen"),;

    private final int id;
    private final String typeName;
    private final String value;

    // Static lookup map for quick retrieval
    private static final Map<Integer, EnumSeenType> TYPE_MAP = Stream.of(values())
            .collect(Collectors.toMap(EnumSeenType::getId, e -> e));

    public static EnumSeenType fromTypeId(int typeId) {
        return TYPE_MAP.get(typeId);
    }

    public static Map<String, Object> toMap(EnumSeenType enumPostType) {
        return Map.of("id", enumPostType.getId(), "typeName", enumPostType.getTypeName(), "value",
                enumPostType.getValue());
    }

    public static String getType(int typeId) {
        return fromTypeId(typeId).getTypeName();
    }
}
