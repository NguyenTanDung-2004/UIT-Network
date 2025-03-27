package com.example.PostService.service.strategy.UserInfoStrategy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.models.UserInfo;
import com.example.PostService.repository.httpclient.UserClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class StudentInfoStrategy implements UserInfoStrategy {
    @Autowired
    private UserClient userClient;

    @Override
    public UserInfo getUserInfo(String userId, Post post) {
        Object object = userClient.getListUserInfos(userId);

        // Use ObjectMapper to convert the object to List<UserInfo>
        ObjectMapper objectMapper = new ObjectMapper();
        List<UserInfo> userInfos = objectMapper.convertValue(object, new TypeReference<List<UserInfo>>() {});

        return userInfos.get(0);
    }

    @Override
    public Boolean createDisplayedFields(Post post) {
        return true;
    }

}
