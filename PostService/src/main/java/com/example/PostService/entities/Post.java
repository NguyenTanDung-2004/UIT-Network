package com.example.PostService.entities;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.PostService.enums.EnumPostType;
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

    private String statusgroup;

    private List<Media> media;

    private Map<String, Object> postType;

    // Getters and Setters

    private boolean isDelete = false;
    private Date deletedDate;

    private String parentId; // group or fanpage (we will save group||groupid or fanpage||fanpageid)
}
