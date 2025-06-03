package com.example.PostService.controller;

import java.util.List;

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
import com.example.PostService.entities.UserLikePost;
import com.example.PostService.repository.LikeRepository;
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
    public ResponseEntity deletePost(//@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(name = "postId") String postId) {
        return postService.deletPost(null, postId);
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

    @GetMapping("/list/group/pending/{groupId}")
    public ResponseEntity getListPendingPostGroup(@PathVariable(name = "groupId") String groupId, @RequestHeader("Authorization") String authorizationHeader) {
        return postService.getListPendingPostGroup(groupId);
    }

    @PostMapping("/group/approve-post/{postid}")
    public ResponseEntity postMethodName(@PathVariable(name = "postid") String postid) {
        return this.postService.approvePost(postid);
    }
    

    @GetMapping("/media/{type}/{objectid}")
    public ResponseEntity getListMedia(@PathVariable(name = "type") String type,
            @PathVariable(name = "objectid") String objectid) {
        return postService.getListMedia(type, objectid);
    }

    @GetMapping("/number-of-like/{postid}")
    public ResponseEntity getMethodName(@PathVariable(name = "postid") String postid) {
        return this.postService.getNumberOfLikes(postid);
    }

    @GetMapping("/is-liked/{postid}/{userid}")
    public ResponseEntity getMethodName2(@PathVariable(name = "postid") String postid, @PathVariable(name = "userid") String userid) {
        return this.postService.checkLiked(postid, userid);
    }
    
    
    

    /*
     * setup data
     */

    @PostMapping("/setup-post")
    public String postMethodName(@RequestHeader("Authorization") String authorizationHeader, @RequestBody List<RequestCreatePost> requestCreatePost) {
        for (int i = 0; i < requestCreatePost.size(); i++){
            this.postService.createPost(requestCreatePost.get(i), authorizationHeader);
        }   
        return "ok";
    }
    
    @Autowired
    private LikeRepository likeRepository;

    @PostMapping("/setup-number-of-like/{postid}")
    public String postMethodName1(@PathVariable(name = "postid") String postid) {
        for (int i = 0; i < 30; i++){
            UserLikePost userLikePost = UserLikePost.builder()
                .userId(null)
                .postId(postid)
                .build();
            likeRepository.save(userLikePost);
        }
        return "ok";
    }
    


}
