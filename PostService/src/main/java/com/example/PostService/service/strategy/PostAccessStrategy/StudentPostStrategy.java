package com.example.PostService.service.strategy.PostAccessStrategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.enums.EnumPostType;
import com.example.PostService.repository.httpclient.FriendClient;

@Component
public class StudentPostStrategy implements PostAccessStrategy {
    @Autowired
    private FriendClient friendClient;

    @Override
    public boolean checkAccess(String userId, Post post) {
        // check owner of post
        if (userId.equals(post.getUserId())) {
            return true;
        }

        EnumPostType enumPostType = EnumPostType.fromTypeId((Integer) post.getPostType().get("id"));
        switch (enumPostType) {
            case NORMAL_STUDENT_POST_FRIEND:
                // check friend
                return isFriend(userId, post.getUserId());

            case NORMAL_STUDENT_POST_PRIVATE:
                return false;

            case NORMAL_STUDENT_POST_PUBLIC:
                return true;
            default:
                break;
        }
        return false;
    }

    private boolean isFriend(String userId, String ownerId) {
        if ((Integer) friendClient.isFriend(userId, ownerId) == 1) {
            return true;
        } else {
            return false;
        }
    }

}
