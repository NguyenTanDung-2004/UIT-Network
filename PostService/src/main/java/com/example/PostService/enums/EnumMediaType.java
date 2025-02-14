
package com.example.PostService.enums;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum EnumMediaType {
    TYPE_FILE(1, "File"),
    TYPE_IMAGE(2, "Image"),
    TYPE_VIDEO(3, "Video");

    private int typeId;
    private String typeName;

    // Static lookup map for quick retrieval
    private static final Map<Integer, EnumMediaType> TYPE_MAP = Stream.of(values())
            .collect(Collectors.toMap(EnumMediaType::getTypeId, e -> e));

    public static EnumMediaType fromTypeId(int typeId) {
        return TYPE_MAP.get(typeId);
    }
}
