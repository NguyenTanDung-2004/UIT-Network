package com.example.NotifiService.Enum;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum EnumNotifiType {
    // LIKE
    LIKE_NORMAL_USER_POST(1, "like_normal_user_post", "like"),

    // COMMENT
    COMMENT_NORMAL_USER_POST(2, "comment_normal_user_post", "comment"),
    
    // TAG
    TAG_NORMAL_USER_POST(3, "tag_normal_user_post", "tag"),
    
    // FRIEND
    ADD_FRIEND(4, "add_friend", "friend"),
    
    // EMAIL
    RESET_PASSWORD(5, "reset_password", "email"),

    ;

    private final int id;
    private final String typeName;
    private final String value;

    // Static lookup map for quick retrieval
    private static final Map<Integer, EnumNotifiType> TYPE_MAP = Stream.of(values())
            .collect(Collectors.toMap(EnumNotifiType::getId, e -> e));

    public static EnumNotifiType fromTypeId(int typeId) {
        return TYPE_MAP.get(typeId);
    }

    public static Map<String, Object> toMap(EnumNotifiType enumPostType) {
        return Map.of("id", enumPostType.getId(), "typeName", enumPostType.getTypeName(), "value",
                enumPostType.getValue());
    }

    public static String getType(int typeId) {
        return fromTypeId(typeId).getTypeName();
    }
}
