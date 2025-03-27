package com.example.PostService.service.strategy.UserInfoStrategy;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.enums.EnumPostType;
import com.example.PostService.models.UserInfo;
import com.example.PostService.repository.httpclient.UserClient;

@Component
public class FanpageInfoStrategy implements UserInfoStrategy {
    @Autowired
    private UserClient userClient;

    @Override
    public UserInfo getUserInfo(String userId, Post post) {
        Object object = userClient.getListUserInfos(userId);

        // parse object to list<userinfo>
        List<UserInfo> userInfos = (List<UserInfo>) object;

        return userInfos.get(0);
    }

    @Override
    public Boolean createDisplayedFields(Post post) {
        // get enum post type
        Integer postTypeId = (Integer) post.getPostType().get("id");
        // EnumPostType enumPostType = EnumPostType.fromTypeId(postTypeId);

        // switch (enumPostType) {
        //     case FANPAGE_POST_PUBLIC:
        //         return "public";
        //     case FANPAGE_POST_PRIVATE:
        //         return "private";
        //     default:
        //         break;
        // }
        return true;
    }

}
