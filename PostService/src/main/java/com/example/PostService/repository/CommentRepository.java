package com.example.PostService.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.PostService.entities.Comment;

public interface CommentRepository extends MongoRepository<Comment, String> {

    @Query(value = "{ 'postId' : ?0, 'isDeleted' : false }")
    List<Comment> findByPostId(String postId);

}
