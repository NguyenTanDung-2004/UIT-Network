package com.example.PostService.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.PostService.entities.Post;
import com.example.PostService.entities.UserLikePost;

public interface LikeRepository extends MongoRepository<UserLikePost, String> {

    UserLikePost findByUserIdAndPostId(String userId, String postId);

    @Query(value = "{ 'postId': ?0}", count = true)
    Integer countLikesByPostId(String postId);
}
