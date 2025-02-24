package com.example.PostService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.PostService.dto.request.RequestCreateComment;
import com.example.PostService.dto.request.RequestUpdateComment;
import com.example.PostService.entities.Comment;
import com.example.PostService.entities.UserLikeComment;
import com.example.PostService.mapper.CommentMapper;
import com.example.PostService.mapper.Mapper;
import com.example.PostService.repository.CommentRepository;
import com.example.PostService.repository.LikeCommentRepository;
import com.example.PostService.response.ApiResponse;
import com.example.PostService.response.EnumResponse;

import feign.Request;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    private Mapper mapper;

    @Autowired
    private LikeCommentRepository likeCommentRepository;

    @Autowired
    public CommentService(CommentMapper commentMapper) {
        this.mapper = commentMapper;
    }

    public ResponseEntity createComment(RequestCreateComment requestCreateComment) {
        // convert to entity
        Comment comment = (Comment) mapper.toEntity(requestCreateComment, null);
        // save to db
        comment = commentRepository.save(comment);
        // return response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(comment)
                .enumResponse(EnumResponse.toJson(EnumResponse.COMMENT_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity updateComment(RequestUpdateComment requestUpdateComment) {
        // find comment
        Comment comment = commentRepository.findById(requestUpdateComment.getCommentId()).get();
        // update data
        comment = (Comment) mapper.toEntity(comment, requestUpdateComment);
        // save to db
        comment = commentRepository.save(comment);
        // return response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(comment)
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_COMMENT_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity deleteComment(String commentId) {
        // find comment
        Comment comment = commentRepository.findById(commentId).get();

        // delete
        commentRepository.delete(comment);

        // return response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.DELETE_COMMENT_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity likeComment(String commentId, String userId) {
        // check like
        UserLikeComment userLikeComment = likeCommentRepository.findByUserIdAndCommentId(userId, commentId);

        if (userLikeComment != null) {
            this.likeCommentRepository.delete(userLikeComment);
        } else {
            // create user like comment
            userLikeComment = UserLikeComment.builder()
                    .commentId(commentId)
                    .userId(userId)
                    .build();

            // save to db
            likeCommentRepository.save(userLikeComment);
        }

        // return response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.LIKE_COMMENT_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
