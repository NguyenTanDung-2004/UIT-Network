package com.example.PostService.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.PostService.entities.Post;

public interface PostRepository extends MongoRepository<Post, String> {

    @Query("{'isDelete': false, 'parentId': null, 'userId': {$in: ?0}}")
    public List<Post> getListFriendPost(List<String> userIds);

    @Query("{'isDelete': false, 'parentId': {$in: ?0}}")
    public List<Post> getListGroupPost(List<String> groupIds);

    @Query("{'isDelete': false, 'parentId': {$in: ?0}}")
    public List<Post> getListFanpagePost(List<String> fanpageIds);
}
