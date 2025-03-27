package com.example.PostService.service.strategy.PostAccessStrategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.enums.EnumPostType;

@Component
public class FanpagePostStrategy implements PostAccessStrategy {
    @Override
    public boolean checkAccess(String userId, Post post) {
        EnumPostType enumPostType = EnumPostType.fromTypeId((Integer) post.getPostType().get("id"));
        switch (enumPostType) {
            case FANPAGE_POST_PUBLIC:
                return true;
            case FANPAGE_POST_PRIVATE:
                return false;
            default:
                break;
        }
        return false;
    }

}
