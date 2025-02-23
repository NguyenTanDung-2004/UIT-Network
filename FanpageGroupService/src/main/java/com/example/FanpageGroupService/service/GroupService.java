package com.example.FanpageGroupService.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.FanpageGroupService.dto.external.UserInfoFromUser;
import com.example.FanpageGroupService.dto.request.RequestAcceptOrRemoveJoinGroup;
import com.example.FanpageGroupService.dto.request.RequestCreateGroup;
import com.example.FanpageGroupService.dto.request.RequestUpdateGroup;
import com.example.FanpageGroupService.dto.response.UserInfoInGroup;
import com.example.FanpageGroupService.entities.Group;
import com.example.FanpageGroupService.entities.user_group.UserGroup;
import com.example.FanpageGroupService.entities.user_group.UserGroupPK;
import com.example.FanpageGroupService.exception.EnumException;
import com.example.FanpageGroupService.exception.ExternalException;
import com.example.FanpageGroupService.exception.UserException;
import com.example.FanpageGroupService.mapper.GroupMapper;
import com.example.FanpageGroupService.mapper.Mapper;
import com.example.FanpageGroupService.repository.GroupRepository;
import com.example.FanpageGroupService.repository.UserGroupRepository;
import com.example.FanpageGroupService.repository.httpclient.UserClient;
import com.example.FanpageGroupService.response.ApiResponse;
import com.example.FanpageGroupService.response.EnumResponse;

import feign.FeignException;

@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserClient userClient;
    private final UserGroupRepository userGroupRepository;
    private final Mapper mapper;

    @Autowired
    public GroupService(GroupRepository groupRepository,
            UserClient userClient,
            UserGroupRepository userGroupRepository,
            GroupMapper groupMapper) {
        this.groupRepository = groupRepository;
        this.userClient = userClient;
        this.userGroupRepository = userGroupRepository;
        this.mapper = groupMapper;
    }

    public ResponseEntity createGroup(RequestCreateGroup request, String authorizationHeader) {
        // get userId
        String userId = getUserId(authorizationHeader);

        // convert request to entity
        Group group = (Group) mapper.toEntity(request, userId);

        // save
        group = this.groupRepository.save(group);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(group)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_FANPAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private String getUserId(String authorizationHeader) {
        // get userId
        String userId;
        try {
            userId = (String) userClient.getUserId(authorizationHeader);
        } catch (Exception e) {
            if (e instanceof FeignException) {
                throw new ExternalException((FeignException) e);
            } else {
                throw new UserException(EnumException.INTERNAL_ERROR);
            }
        }

        return userId;
    }

    public ResponseEntity updateGroup(RequestUpdateGroup request) {
        // get group
        Group group = this.getGroupById(request.getGroupId());

        // update
        group = (Group) this.mapper.toEntity(request, group);

        // save
        group = this.groupRepository.save(group);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(group)
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_GROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);

    }

    private Group getGroupById(String groupId) {
        Optional<Group> optional = this.groupRepository.findById(groupId);

        if (optional.isEmpty()) {
            throw new UserException(EnumException.GROUP_NOT_FOUND);
        }
        return optional.get();
    }

    public ResponseEntity deleteGroup(String groupId) {
        Date date = new Date();

        // get group
        Group group = this.getGroupById(groupId);

        // update
        group.setDeletedDate(date);
        group.setIsDelete(true);

        // save
        group = this.groupRepository.save(group);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.DELETE_GROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity requestToJoinGroup(String groupId, String authorizationHeader) {
        // get userId
        String userId = this.getUserId(authorizationHeader);

        // create pk usergroup
        UserGroupPK userGroupPK = createUserGroupPK(userId, groupId);

        // create usergroup
        UserGroup userGroup = new UserGroup();
        userGroup = (UserGroup) this.mapper.toEntity(userGroupPK, userGroup);

        // save
        userGroup = this.userGroupRepository.save(userGroup);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.RQEUEST_JOINGROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private UserGroupPK createUserGroupPK(String userId, String groupId) {
        return UserGroupPK.builder()
                .userId(userId)
                .groupId(groupId)
                .build();
    }

    public ResponseEntity getJoinRequests(String groupId) {
        // get requested users
        List<UserGroup> requestedUsers = this.userGroupRepository.getRequestedUsers(groupId, false);

        if (requestedUsers.size() == 0) {
            // create response
            ApiResponse apiResponse = ApiResponse.builder()
                    .object(new ArrayList<>())
                    .enumResponse(EnumResponse.toJson(EnumResponse.GET_REQUESTJOINGROUP_SUCCESS))
                    .build();

            return ResponseEntity.ok(apiResponse);
        }

        StringBuilder userIds = new StringBuilder("");

        // convert to UserInfoInGroup
        List<UserInfoInGroup> listUserInfoInGroups = new ArrayList<>();
        for (int i = 0; i < requestedUsers.size(); i++) {
            listUserInfoInGroups.add((UserInfoInGroup) this.mapper.toObject(requestedUsers.get(i), null));

            // set userIds
            userIds.append(requestedUsers.get(i).getUserId());
            if (i <= requestedUsers.size() - 2) {
                userIds.append(",");
            }
        }

        // get userinfo from userservice
        List<UserInfoFromUser> listUserInfoFromUsers = this.userClient.getUserInfo(userIds.toString());
        for (int i = 0; i < listUserInfoInGroups.size(); i++) {
            UserInfoInGroup userInfo = listUserInfoInGroups.get(i);
            userInfo = (UserInfoInGroup) this.mapper.toObject(listUserInfoFromUsers.get(i), userInfo);
        }

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(listUserInfoInGroups)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_REQUESTJOINGROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @Transactional
    public ResponseEntity acceptJoinRequest(String groupId, RequestAcceptOrRemoveJoinGroup requestAcceptJoinGroup) {
        // update
        this.userGroupRepository.acceptJoinRequest(groupId, requestAcceptJoinGroup.getUserId());

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.ACCEPT_REQUESTJOINGROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @Transactional
    public ResponseEntity removeJoinRequest(String groupId, RequestAcceptOrRemoveJoinGroup request) {
        // update
        this.userGroupRepository.removeJoinRequest(groupId, request.getUserId());

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.REMOVE_REQUESTJOINGROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity isMember(String groupId, String userId) {
        // check
        int isMember = this.userGroupRepository.isMember(userId);

        return ResponseEntity.ok(isMember);
    }

}
