package com.example.PostService.service;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.example.PostService.dto.external.ExternalFanpageInfo;
import com.example.PostService.dto.external.ExternalGroupInfo;
import com.example.PostService.dto.external.ExternalUserInfo;
import com.example.PostService.dto.request.RequestCreatePost;
import com.example.PostService.dto.request.RequestUpdatePost;
import com.example.PostService.entities.Post;
import com.example.PostService.entities.UserLikePost;
import com.example.PostService.exception.EnumException;
import com.example.PostService.exception.ExternalException;
import com.example.PostService.exception.UserException;
import com.example.PostService.mapper.Mapper;
import com.example.PostService.mapper.PostMapper;
import com.example.PostService.models.UserInfo;
import com.example.PostService.repository.LikeRepository;
import com.example.PostService.repository.PostRepository;
import com.example.PostService.repository.httpclient.FanpageClient;
import com.example.PostService.repository.httpclient.FriendClient;
import com.example.PostService.repository.httpclient.GroupClient;
import com.example.PostService.repository.httpclient.UserClient;
import com.example.PostService.response.ApiResponse;
import com.example.PostService.response.EnumResponse;
import com.example.PostService.service.strategy.PostAccessStrategy.PostAccessStrategy;
import com.example.PostService.service.strategy.PostAccessStrategy.PostAccessStrategyFactory;
import com.example.PostService.service.strategy.UserInfoStrategy.UserInfoStrategy;
import com.example.PostService.service.strategy.UserInfoStrategy.UserInfoStrategyFactory;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    @Autowired
    private PostAccessStrategyFactory postAccessStrategyFactory;

    @Autowired
    private UserInfoStrategyFactory userInfoStrategyFactory;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private FriendClient friendClient;

    @Autowired
    private GroupClient groupClient;

    @Autowired
    private FanpageClient fanpageClient;

    @Autowired
    private KafkaService kafkaService;

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

    public ResponseEntity likePost(String authorizationHeader, String postId) {
        // get userId
        String userId = getUserId(authorizationHeader);

        // check like
        UserLikePost userLikePost = likeRepository.findByUserIdAndPostId(userId, postId);

        if (userLikePost != null) {
            this.likeRepository.delete(userLikePost);
        } else {
            // create user like post
            userLikePost = UserLikePost.builder()
                    .postId(postId)
                    .userId(userId)
                    .build();

            // save
            likeRepository.save(userLikePost);
        }

        // get post 
        Post post = getPost(postId);    

        // push to kafka
        this.kafkaService.sendMessage("user-notification", post, userId, "reacted to your post.");

        // response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.LIKE_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity getPostDetail(String authorizationHeader, String postId) {
        // get post
        Post post = getPost(postId);

        // get userid
        String userId = getUserId(authorizationHeader);

        // check permission
        PostAccessStrategy postAccessStrategy = postAccessStrategyFactory.getStrategy((String) post.getPostType().get("typeName"));
        if (postAccessStrategy.checkAccess(userId, post) == false) {
            throw new UserException(EnumException.POST_PERMISSION_DENIED);
        }

        // get user info
        UserInfoStrategy userInfoStrategy = userInfoStrategyFactory.getUserInfoStrategy((String) post.getPostType().get("typeName"));

        UserInfo userInfo = userInfoStrategy.getUserInfo(userId, post);

        // displayed fields
        Boolean display = userInfoStrategy.createDisplayedFields(post);

        // create response
        Map<String, Object> response = new HashMap<>();
        response.put("post", post);
        response.put("userInfo", userInfo); 
        response.put("display", display);

        ApiResponse apiResponse = ApiResponse.builder()
                .object(response)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_POST_DETAIL_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity getListPostHome(String authorizationHeader){
        // get userid
        String userId = getUserId(authorizationHeader);

        ObjectMapper objectMapper = new ObjectMapper();

        // get list friend of user
        List<String> friendids = objectMapper.convertValue(this.friendClient.getListFriends(userId), 
            new TypeReference<List<String>>() {});

        // get fanpage that is followed by user
        List<String> fanpageIds = objectMapper.convertValue(this.fanpageClient.getListFanpage(userId), 
            new TypeReference<List<String>>() {});
        appendListIds(fanpageIds, "fanpage");
        
        // get group that is joined by user
        List<String> groupIds = objectMapper.convertValue(this.groupClient.getListGroup(userId), 
            new TypeReference<List<String>>() {});
        appendListIds(groupIds, "group");

        // create query
        List<Post> listFriendPosts = this.postRepository.getListFriendPost(friendids);
        List<Post> listGroupPosts = this.postRepository.getListGroupPost(groupIds);
        List<Post> listFanpagePosts = this.postRepository.getListFanpagePost(fanpageIds);

        List<Post> listPost = new ArrayList<>();
        listPost.addAll(listFriendPosts);
        listPost.addAll(listGroupPosts);
        listPost.addAll(listFanpagePosts);

        // sort by created date
        listPost.sort((p1, p2) -> p2.getCreatedDate().compareTo(p1.getUpdatedDate()));

        // get user info
        Object listUserInfos = this.userClient.getListUserInfos(convertListToString(listPost.stream().map(Post::getUserId).toList()));
        List<ExternalUserInfo> externalUserInfos = objectMapper.convertValue(listUserInfos, new TypeReference<List<ExternalUserInfo>>() {});
        
        // get fanpage info
        Object listFanpageInfos = this.fanpageClient.getListFanpageInfos(
            convertListToString(
                listFanpagePosts.stream()
                    .map(Post::getParentId) // Extract parentId
                    .filter(parentId -> parentId.startsWith("fanpage||")) // Ensure it starts with "fanpage||"
                    .map(parentId -> parentId.replace("fanpage||", "")) // Remove "fanpage||" prefix
                    .toList() // Collect as a list
            )
        );
        List<ExternalFanpageInfo> externalFanpageInfos = objectMapper.convertValue(listFanpageInfos, new TypeReference<List<ExternalFanpageInfo>>() {});

        // get group info
        Object listGroupInfos = this.groupClient.getListGroupInfos(
            convertListToString(
                listGroupPosts.stream()
                    .map(Post::getParentId) // Extract parentId
                    .filter(parentId -> parentId.startsWith("group||")) // Ensure it starts with "fanpage||"
                    .map(parentId -> parentId.replace("group||", "")) // Remove "fanpage||" prefix
                    .toList() // Collect as a list
            )
        );
        List<ExternalGroupInfo> externalGroupInfos = objectMapper.convertValue(listGroupInfos, new TypeReference<List<ExternalGroupInfo>>() {});

        // create response
        Map<String, Object> response = new HashMap<>();
        response.put("listPost", listPost);
        response.put("listUserInfos", externalUserInfos);
        response.put("listFanpageInfos", externalFanpageInfos);
        response.put("listGroupInfos", externalGroupInfos);

        ApiResponse apiResponse = ApiResponse.builder()
                .object(response)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_POST_DETAIL_SUCCESS))
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    public void appendListIds(List<String> listIds, String appendedString){
        for (int i = 0; i < listIds.size(); i++) {
            listIds.set(i, appendedString + "||" + listIds.get(i));
        }
    }

    public String convertListToString(List<String> list) {
        System.out.println(list.stream()
        //.map(item -> "\"" + item + "\"") // Add quotes around each item
        .collect(Collectors.joining(","))); // Join items with a comma)
        return list.stream()
                //.map(item -> "\"" + item + "\"") // Add quotes around each item
                .collect(Collectors.joining(",")); // Join items with a comma
    }

    public ResponseEntity getListPostOfUser(String userId) {
        // get list post of user
        List<Post> posts = this.postRepository.getListFriendPost(List.of(userId));
        Map<String, Object> map = new HashMap<>();

        // check null
        if (posts == null) {
            posts = new ArrayList<>();
        }
        else{
            map.put("listPost", posts);

            // get user info
            Object listUserInfos = this.userClient.getListUserInfos(userId);
            List<ExternalUserInfo> externalUserInfos = new ObjectMapper().convertValue(listUserInfos, new TypeReference<List<ExternalUserInfo>>() {});
            map.put("listUserInfos", externalUserInfos);
        }

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(map)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_LIST_USER_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity getListPostOfFanpage(String fanpageId) {
        // get list post of fanpage
        List<Post> posts = this.postRepository.getListFanpagePost(List.of("fanpage||" + fanpageId));
        Map<String, Object> map = new HashMap<>();

        // check null
        if (posts == null) {
            posts = new ArrayList<>();
        }
        else{
            map.put("listPost", posts);

            // get user info
            Object listUserInfos = this.userClient.getListUserInfos(convertListToString(posts.stream().map(Post::getUserId).toList()));
            List<ExternalUserInfo> externalUserInfos = new ObjectMapper().convertValue(listUserInfos, new TypeReference<List<ExternalUserInfo>>() {});
            map.put("listUserInfos", externalUserInfos);
        }

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(map)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_LIST_FANPAGE_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity getListPostOfGroup(String groupId) {
        // get list post of group
        List<Post> posts = this.postRepository.getListGroupPost(List.of("group||" + groupId));
        Map<String, Object> map = new HashMap<>();

        // check null
        if (posts == null) {
            posts = new ArrayList<>();
        }
        else{
            map.put("listPost", posts);

            // get user info
            Object listUserInfos = this.userClient.getListUserInfos(convertListToString(posts.stream().map(Post::getUserId).toList()));
            List<ExternalUserInfo> externalUserInfos = new ObjectMapper().convertValue(listUserInfos, new TypeReference<List<ExternalUserInfo>>() {});
            map.put("listUserInfos", externalUserInfos);
        }

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(map)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_LIST_GROUP_POST_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
