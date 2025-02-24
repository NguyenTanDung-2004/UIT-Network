package com.example.PostService.entities;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.PostService.models.media.Media;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "comments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String content;
    private Date creatDate;
    private Date modifiedDate;
    private Date deletedDate;
    private boolean isDeleted;
    private List<Media> mediaList;
    private List<String> tagIds;
    private String parentCommentId;

    public void setListMedia(List<Media> listMedia) {
        this.mediaList = listMedia;
    }
}
