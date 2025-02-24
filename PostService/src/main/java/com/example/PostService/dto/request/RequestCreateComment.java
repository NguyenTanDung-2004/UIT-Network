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
public class RequestCreateComment {
    private String postId;
    private String userId;
    private String content;
    private String parentCommentId;
    private List<Media> listMedia;
    private List<String> tagIds;
}
