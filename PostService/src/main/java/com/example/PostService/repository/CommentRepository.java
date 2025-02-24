package com.example.PostService.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.PostService.entities.Comment;

public interface CommentRepository extends MongoRepository<Comment, String> {

}
