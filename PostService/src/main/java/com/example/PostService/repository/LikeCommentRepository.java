package com.example.PostService.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.PostService.entities.UserLikeComment;

public interface LikeCommentRepository extends MongoRepository<UserLikeComment, String> {

    UserLikeComment findByUserIdAndCommentId(String userId, String commentId);

}
