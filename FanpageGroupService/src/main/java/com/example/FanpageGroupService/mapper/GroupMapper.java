package com.example.FanpageGroupService.mapper;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.FanpageGroupService.dto.external.UserInfoFromUser;
import com.example.FanpageGroupService.dto.request.RequestCreateFanpage;
import com.example.FanpageGroupService.dto.request.RequestCreateGroup;
import com.example.FanpageGroupService.dto.request.RequestUpdateFanpage;
import com.example.FanpageGroupService.dto.request.RequestUpdateGroup;
import com.example.FanpageGroupService.dto.response.UserInfoInGroup;
import com.example.FanpageGroupService.entities.Fanpage;
import com.example.FanpageGroupService.entities.Group;
import com.example.FanpageGroupService.entities.user_group.UserGroup;
import com.example.FanpageGroupService.entities.user_group.UserGroupPK;

@Component
public class GroupMapper implements Mapper {

    @Override
    public Object toEntity(Object object1, Object object2) {
        if (object1 instanceof RequestCreateGroup) {
            return toEntity((RequestCreateGroup) object1, (String) object2);
        } else if (object1 instanceof RequestUpdateGroup) {
            return toEntity((RequestUpdateGroup) object1, (Group) object2);
        } else if (object1 instanceof UserGroupPK) {
            return toEntity((UserGroupPK) object1, (UserGroup) object2);
        } else {
            return null;
        }
    }

    public Group toEntity(RequestCreateGroup requestCreateGroup, String userId) {
        Date date = new Date();
        return Group.builder()
                .name(requestCreateGroup.getName())
                .intro(requestCreateGroup.getIntro())
                .phone(requestCreateGroup.getPhone())
                .email(requestCreateGroup.getEmail())
                .avtURL(requestCreateGroup.getAvtURL())
                .backgroundURL(requestCreateGroup.getBackgroundURL())
                .createdUserId(userId)
                .createdDate(date)
                .updatedDate(date)
                .build();
    }

    public Group toEntity(RequestUpdateGroup request, Group group) {
        Date date = new Date();

        group.setName(request.getName());
        group.setIntro(request.getIntro());
        group.setPhone(request.getPhone());
        group.setEmail(request.getEmail());
        group.setAvtURL(request.getAvtURL());
        group.setBackgroundURL(request.getBackgroundURL());
        group.setUpdatedDate(date);

        return group;
    }

    public UserGroup toEntity(UserGroupPK pk, UserGroup userGroup) {
        Date date = new Date();
        return UserGroup.builder()
                .userId(pk.getUserId())
                .groupId(pk.getGroupId())
                .accepted(false)
                .requestedDate(date)
                .build();
    }

    public UserInfoInGroup toUserInfoInGroup(UserGroup userGroup, Object object) {
        return UserInfoInGroup.builder()
                .userId(userGroup.getUserId())
                .date(userGroup.getRequestedDate())
                .build();
    }

    public UserInfoInGroup toUserInfoInGroup(UserInfoFromUser userInfo, UserInfoInGroup userInfoInGroup) {
        userInfoInGroup.setAvtURL(userInfo.getAvtURL());
        userInfoInGroup.setUserName(userInfo.getUserName());
        userInfoInGroup.setStudentId(userInfo.getStudentId());
        return userInfoInGroup;
    }

    @Override
    public Object toObject(Object object1, Object object2) {
        if (object1 instanceof UserGroup) {
            return toUserInfoInGroup((UserGroup) object1, object2);
        } else if (object1 instanceof UserInfoFromUser) {
            return toUserInfoInGroup((UserInfoFromUser) object1, (UserInfoInGroup) object2);
        } else {
            return null;
        }
    }

}
