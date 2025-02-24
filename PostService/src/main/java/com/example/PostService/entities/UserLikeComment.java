package com.example.PostService.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "user_like_comment")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLikeComment {
    @Id
    private String id;
    private String userId;
    private String commentId;
}
