package com.example.ChatService.enums;



import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EnumGroupType {
    IsGroup(1, "IsGroup", "IsGroup"),
    IsUser(2, "IsUser", "IsUser"),;

    private final int id;
    private final String typeName;
    private final String value;

    // Static lookup map for quick retrieval
    private static final Map<Integer, EnumGroupType> TYPE_MAP = Stream.of(values())
            .collect(Collectors.toMap(EnumGroupType::getId, e -> e));

    public static EnumGroupType fromTypeId(int typeId) {
        return TYPE_MAP.get(typeId);
    }

    public static Map<String, Object> toMap(EnumGroupType enumPostType) {
        return Map.of("id", enumPostType.getId(), "typeName", enumPostType.getTypeName(), "value",
                enumPostType.getValue());
    }

    public static String getType(int typeId) {
        return fromTypeId(typeId).getTypeName();
    }
}
