package com.example.PostService.service.strategy.UserInfoStrategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.enums.EnumPostType;

@Component
public class UserInfoStrategyFactory {
    @Autowired
    private StudentInfoStrategy studentInfoStrategy;
    @Autowired
    private FanpageInfoStrategy fanpageInfoStrategy;
    @Autowired
    private UserGroupInfoStrategy userGroupInfoStrategy;

    public UserInfoStrategy getUserInfoStrategy(String postType) {
        switch (postType) {
            case "fanpage_post":
                return fanpageInfoStrategy;
            case "study_group_post":
                return userGroupInfoStrategy;
            case "normal_student_post":
                return studentInfoStrategy;
            default:
                return null;
        }
    }
}
