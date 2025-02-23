package com.example.PostService.service.strategy.PostAccessStrategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.repository.httpclient.GroupClient;

@Component
public class StudyGroupStrategy implements PostAccessStrategy {

    @Autowired
    private GroupClient groupClient;

    @Override
    public boolean checkAccess(String userId, Post post) {
        // split parentid to get group id
        String[] parts = post.getParentId().split("||");

        if ((Integer) groupClient.isMember(userId, parts[1]) == 1) {
            return true;
        } else {
            return false;
        }
    }

}
