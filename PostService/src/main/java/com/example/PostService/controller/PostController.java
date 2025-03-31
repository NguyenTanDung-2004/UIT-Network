package com.example.PostService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
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

    @GetMapping("/like")
    public ResponseEntity likePost(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "postId") String postId) {
        return postService.likePost(authorizationHeader, postId);
    }

    @GetMapping("/detail/{postId}")
    public ResponseEntity getPostDetail(@RequestHeader("Authorization") String authorizationHeader, @PathVariable(name = "postId") String postId) {
        return postService.getPostDetail(authorizationHeader, postId);
    }

    @GetMapping("/list/home")
    public ResponseEntity getListPostHome(@RequestHeader("Authorization") String authorizationHeader) {
        return postService.getListPostHome(authorizationHeader);
    }

    @GetMapping("/list/user/{userId}")
    public ResponseEntity getListPostUser(@PathVariable(name = "userId") String userId, @RequestHeader("Authorization") String authorizationHeader) {
        return postService.getListPostOfUser(userId);
    }

    @GetMapping("/list/fanpage/{fanpageId}")
    public ResponseEntity getListPostFanpage(@PathVariable(name = "fanpageId") String fanpageId, @RequestHeader("Authorization") String authorizationHeader) {
        return postService.getListPostOfFanpage(fanpageId);
    }

    @GetMapping("/list/group/{groupId}")
    public ResponseEntity getListPostGroup(@PathVariable(name = "groupId") String groupId, @RequestHeader("Authorization") String authorizationHeader) {
        return postService.getListPostOfGroup(groupId);
    }
}
