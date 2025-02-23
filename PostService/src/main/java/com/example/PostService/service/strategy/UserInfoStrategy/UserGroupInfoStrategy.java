package com.example.PostService.service.strategy.UserInfoStrategy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.enums.EnumPostType;
import com.example.PostService.models.PostType;
import com.example.PostService.models.UserInfo;
import com.example.PostService.repository.httpclient.UserClient;

@Component
public class UserGroupInfoStrategy implements UserInfoStrategy {
    @Autowired
    private UserClient userClient;

    @Override
    public UserInfo getUserInfo(String userId, Post post) {
        Object object = userClient.getListUserInfos(userId);

        // parse object to list<userinfo>
        List<UserInfo> userInfos = (List<UserInfo>) object;

        UserInfo userInfo = userInfos.get(0);

        EnumPostType enumPostType = EnumPostType.fromTypeId((Integer) post.getPostType().get("id"));

        if (enumPostType == EnumPostType.STUDY_GROUP_POST_ANONY) {
            // update user info
            userInfo.setAvtURL(null);
            userInfo.setStudentId(null);
            userInfo.setUserName(null);
            userInfo.setUserId(null);
            // updatre post info
            post.setUserId(null);
        }

        return userInfo;
    }

}
