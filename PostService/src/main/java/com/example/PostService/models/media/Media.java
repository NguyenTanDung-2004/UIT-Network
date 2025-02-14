package com.example.PostService.models.media;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Data
@SuperBuilder
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "typeId", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = File.class, name = "1"),
        /*
         * The reason we must put 1 into "" is that Jackson does not allow an "int"
         * directly inside "name"
         */
        @JsonSubTypes.Type(value = Image.class, name = "2"),
        @JsonSubTypes.Type(value = Video.class, name = "3")
})
public abstract class Media {
    private int typeId; // image, video, file
    private String url;
}
