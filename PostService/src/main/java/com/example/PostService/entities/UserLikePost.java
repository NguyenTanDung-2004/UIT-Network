package com.example.PostService.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "likes")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLikePost {
    @Id
    private String id;
    private String postId;
    private String userId;
}
