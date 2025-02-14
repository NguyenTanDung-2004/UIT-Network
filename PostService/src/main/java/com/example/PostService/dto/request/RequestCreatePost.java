package com.example.PostService.dto.request;

import java.sql.Date;
import java.util.List;

import com.example.PostService.models.PostType;
import com.example.PostService.models.UserInfo;
import com.example.PostService.models.media.Media;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequestCreatePost {
    private String caption;

    private List<Media> media;

    private int postTypeId;
}
