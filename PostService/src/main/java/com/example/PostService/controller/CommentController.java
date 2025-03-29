package com.example.PostService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.PostService.dto.request.RequestCreateComment;
import com.example.PostService.dto.request.RequestUpdateComment;
import com.example.PostService.service.CommentService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("")
    public ResponseEntity createComment(@RequestBody RequestCreateComment requestCreateComment) {
        return commentService.createComment(requestCreateComment);
    }

    @PutMapping("")
    public ResponseEntity updateComment(@RequestBody RequestUpdateComment requestUpdateComment) {
        return commentService.updateComment(requestUpdateComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity deleteComment(@PathVariable(name = "commentId") String commentId) {
        return commentService.deleteComment(commentId);
    }

    @GetMapping("/{commentId}/{userId}")
    public ResponseEntity likeComment(@PathVariable(name = "commentId") String commentId,
            @PathVariable(name = "userId") String userId) {
        return commentService.likeComment(commentId, userId);
    }

    @GetMapping("/{postId}")
    public ResponseEntity getListComment(@PathVariable(name = "postId") String postId) {
        return commentService.getListComment(postId);
    }
}
