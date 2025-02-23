package com.example.PostService.service.strategy.PostAccessStrategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.enums.EnumPostType;

@Component
public class FanpagePostStrategy implements PostAccessStrategy {
    @Override
    public boolean checkAccess(String userId, Post post) {
        if (EnumPostType.fromTypeId((Integer) post.getPostType().get("id")) == EnumPostType.FANPAGE_POST_PRIVATE) {
            return false;

        }
        return true;
    }

}
