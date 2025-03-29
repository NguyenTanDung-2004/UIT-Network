package com.example.PostService.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.PostService.dto.request.RequestCreateComment;
import com.example.PostService.dto.request.RequestUpdateComment;
import com.example.PostService.dto.response.ResponseListComment;
import com.example.PostService.entities.Comment;
import com.example.PostService.entities.UserLikeComment;
import com.example.PostService.mapper.CommentMapper;
import com.example.PostService.mapper.Mapper;
import com.example.PostService.models.ParentComment;
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

    public ResponseEntity getListComment(String postId) {
        // get list comments
        List<Comment> comments = commentRepository.findByPostId(postId);

        List<ParentComment> listParentComment = new ArrayList<>();

        if (comments != null && comments.size()!= 0){
            createResponseListParent(listParentComment, comments);
        }

        ApiResponse apiResponse = ApiResponse.builder()
                    .object(listParentComment)
                    .enumResponse(EnumResponse.toJson(EnumResponse.GET_LIST_COMMENT_SUCCESS))
                    .build();

        return ResponseEntity.ok(apiResponse);
    }

    private void createResponseListParent(List<ParentComment> listParentComment, List<Comment> comments) {
        // create list parent comment
        List<Comment> parentComments = new ArrayList<>();
        Map<String, List<Comment>> parentidAndChild = new HashMap<>();
        comments.stream().forEach(comment -> {
            // get comment id from comment
            String commentId = comment.getId();

            // check if comment is Parent comment
            if (comment.getParentCommentId() == null) {
                parentidAndChild.put(commentId, new ArrayList<>());
                parentComments.add(comment);
            }
        });

        // add child to parent comment
        comments.stream().forEach(comment -> {
            // get parent comment id
            String parentCommentId = comment.getParentCommentId();
            if (parentCommentId != null) {
                parentidAndChild.get(parentCommentId).add(comment);
            }
        });

        // set data for response list comment
        parentComments.stream().forEach(parentComment -> {
            ParentComment parent = new ParentComment();
            parent.setParentComment(parentComment);
            parent.setListComment(parentidAndChild.get(parentComment.getId()));

            listParentComment.add(parent);
        });
    }
}
