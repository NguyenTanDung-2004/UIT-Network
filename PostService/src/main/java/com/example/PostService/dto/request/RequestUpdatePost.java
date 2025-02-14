package com.example.PostService.dto.request;

import java.util.List;

import com.example.PostService.models.media.Media;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequestUpdatePost {
    private String postId;

    private String caption;

    private List<Media> media;

    private int postTypeId;
}
