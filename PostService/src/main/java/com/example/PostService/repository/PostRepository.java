package com.example.PostService.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.PostService.entities.Post;

public interface PostRepository extends MongoRepository<Post, String> {

}
