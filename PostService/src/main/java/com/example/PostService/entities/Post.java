package com.example.PostService.entities;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.PostService.models.PostType;
import com.example.PostService.models.UserInfo;
import com.example.PostService.models.media.Media;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "post")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Post {
    @Id
    private String postId;

    private String userId;
    private Date createdDate;
    private Date updatedDate;
    private String caption;

    private List<Media> media;

    private int postTypeId;

    // Getters and Setters

    private boolean isDelete = false;
    private Date deletedDate;
}
