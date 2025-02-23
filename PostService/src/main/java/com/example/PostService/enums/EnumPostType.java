package com.example.PostService.enums;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EnumPostType {
    // normal student post
    NORMAL_STUDENT_POST_FRIEND(1, "normal_student_post", "friend"),
    NORMAL_STUDENT_POST_PUBLIC(2, "normal_student_post", "public"),
    NORMAL_STUDENT_POST_PRIVATE(3, "normal_student_post", "private"),

    // fanpage post
    FANPAGE_POST_PUBLIC(4, "fanpage_post", "public"),
    FANPAGE_POST_PRIVATE(5, "fanpage_post", "private"),

    // study group post
    STUDY_GROUP_POST_ANONY(6, "study_group_post", "anonymous"),
    STUDY_GROUP_POST_UNANONY(7, "study_group_post", "unanonymous");

    private final int id;
    private final String typeName;
    private final String value;

    // Static lookup map for quick retrieval
    private static final Map<Integer, EnumPostType> TYPE_MAP = Stream.of(values())
            .collect(Collectors.toMap(EnumPostType::getId, e -> e));

    public static EnumPostType fromTypeId(int typeId) {
        return TYPE_MAP.get(typeId);
    }

    public static Map<String, Object> toMap(EnumPostType enumPostType) {
        return Map.of("id", enumPostType.getId(), "typeName", enumPostType.getTypeName(), "value",
                enumPostType.getValue());
    }

    public static String getType(int typeId) {
        return fromTypeId(typeId).getTypeName();
    }
}
