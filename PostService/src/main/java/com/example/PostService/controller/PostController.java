package com.example.PostService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.PostService.dto.request.RequestCreatePost;
import com.example.PostService.dto.request.RequestUpdatePost;
import com.example.PostService.service.PostService;

@RestController
@RequestMapping("/post")
public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping("/create")
    public ResponseEntity createPost(@RequestBody RequestCreatePost requestCreatePost,
            @RequestHeader("Authorization") String authorizationHeader) {
        return postService.createPost(requestCreatePost, authorizationHeader);
    }

    @PostMapping("/update")
    public ResponseEntity updatePost(@RequestBody RequestUpdatePost requestUpdatePost,
            @RequestHeader("Authorization") String authorizationHeader) {
        return postService.updatePost(requestUpdatePost, authorizationHeader);
    }

    @DeleteMapping("/delete")
    public ResponseEntity deletePost(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "postId") String postId) {
        return postService.deletPost(authorizationHeader, postId);
    }

    @GetMapping("/detail/{postId}")
    public ResponseEntity getPostDetail(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "postId") String postId) {
        return postService.getPostDetail(authorizationHeader, postId);
    }
}
