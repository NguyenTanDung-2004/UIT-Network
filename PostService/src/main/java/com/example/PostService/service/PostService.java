package com.example.PostService.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.PostService.dto.external.ExternalUserInfo;
import com.example.PostService.dto.request.RequestCreatePost;
import com.example.PostService.dto.request.RequestUpdatePost;
import com.example.PostService.entities.Post;
import com.example.PostService.exception.EnumException;
import com.example.PostService.exception.ExternalException;
import com.example.PostService.exception.UserException;
import com.example.PostService.mapper.Mapper;
import com.example.PostService.mapper.PostMapper;
import com.example.PostService.models.UserInfo;
import com.example.PostService.repository.PostRepository;
import com.example.PostService.repository.httpclient.UserClient;
import com.example.PostService.response.ApiResponse;
import com.example.PostService.response.EnumResponse;

import feign.FeignException;

@Service
public class PostService {
    private final Mapper mapper;

    @Autowired
    public PostService(PostMapper postMapper) {
        this.mapper = postMapper;
    }

    @Autowired
    private UserClient userClient;

    @Autowired
    private PostRepository postRepository;

    public ResponseEntity createPost(RequestCreatePost requestCreatePost, String authorizationHeader) {
        // get userId
        String userId = getUserId(authorizationHeader);

        // convert to post
        Post post = (Post) this.mapper.toEntity(requestCreatePost, null);

        // set data
        post.setUserId(userId);

        // save
        post = this.postRepository.save(post);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(post)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private String getUserId(String authorizationHeader) {
        // get userId
        String userId;
        try {
            userId = (String) userClient.getUserId(authorizationHeader);
        } catch (Exception e) {
            if (e instanceof FeignException) {
                throw new ExternalException((FeignException) e);
            } else {
                throw new UserException(EnumException.INTERNAL_ERROR);
            }
        }

        return userId;
    }

    public ResponseEntity updatePost(RequestUpdatePost request, String authorizationHeader) {
        // get post
        Post post = getPost(request.getPostId());

        // update data
        post = (Post) this.mapper.toEntity(request, post);

        // save
        post = this.postRepository.save(post);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(post)
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);

    }

    public Post getPost(String postId) {
        Optional<Post> optional = this.postRepository.findById(postId);

        if (optional.isPresent()) {
            return optional.get();
        } else {
            throw new UserException(EnumException.POST_NOT_FOUND);
        }
    }

    public ResponseEntity deletPost(String authorizationHeader, String postId) {
        // get post
        Post post = getPost(postId);

        // update
        post.setDelete(true);
        post.setDeletedDate(new Date());

        // save
        this.postRepository.save(post);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.DELETE_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
