package com.example.PostService.service.strategy.PostAccessStrategy;

import com.example.PostService.entities.Post;

public interface PostAccessStrategy {
    public boolean checkAccess(String userId, Post post);
}
