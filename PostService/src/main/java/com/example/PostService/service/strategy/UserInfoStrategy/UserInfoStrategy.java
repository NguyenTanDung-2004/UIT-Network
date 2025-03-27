package com.example.PostService.service.strategy.UserInfoStrategy;

import com.example.PostService.entities.Post;
import com.example.PostService.models.UserInfo;

public interface UserInfoStrategy {
    public UserInfo getUserInfo(String userId, Post post);

    public Boolean createDisplayedFields(Post post);
}
