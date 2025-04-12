package com.example.ChatService.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.RequestAddMember;
import com.example.ChatService.dto.RequestCreateGroup;
import com.example.ChatService.entity.Group;
import com.example.ChatService.enums.EnumGroupType;
import com.example.ChatService.enums.EnumStatus;
import com.example.ChatService.mapper.GroupMapper;
import com.example.ChatService.repository.GroupRepository;
import com.example.ChatService.repository.httpclient.UserClient;
import com.example.ChatService.response.ApiResponse;
import com.example.ChatService.response.EnumResponse;

import jakarta.transaction.Transactional;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserClient userClient;

    @Autowired
    private GroupMapper groupMapper;

    @Autowired
    private UserGroupService userGroupService;

    public ResponseEntity createGroup(RequestCreateGroup request, String authorizationHeader) {
        // get userid from header
        String userId = (String) userClient.getUserId(authorizationHeader);

        // create extra fields
        Map<String, Object> extraFields = new HashMap<>();
        extraFields.put("ownerid", userId);
        

        // convert request to entity
        Group group = (Group) groupMapper.toEntity(request, extraFields);

        // save group to database
        group = this.groupRepository.save(group);

        // create member in group
        request.getMemberids().add(userId);
        userGroupService.createUserGroup(request.getMemberids(), group.getId());
        // return response
        ApiResponse response = ApiResponse.builder()
                .object(group)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_GROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }

    public ResponseEntity addMembers(RequestAddMember request, String authorizationHeader) {
        this.userGroupService.createUserGroup(request.getMemberids(), request.getGroupid());

        // return response
        ApiResponse response = ApiResponse.builder()
                .object(request)
                .enumResponse(EnumResponse.toJson(EnumResponse.ADD_MEMBER_SUCCESS))
                .build();
        return ResponseEntity.ok(response);
    }

    @Transactional(rollbackOn = { Exception.class })
    public ResponseEntity removeMembers(RequestAddMember request, String authorizationHeader) {
        this.groupRepository.removeUserGroup(request.getMemberids(), request.getGroupid());

        // return response
        ApiResponse response = ApiResponse.builder()
                .object(request)
                .enumResponse(EnumResponse.toJson(EnumResponse.REMOVE_MEMBER_SUCCESS))
                .build();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity checkUserGroup(String userid1, String userid2) {
        String groupid = this.groupRepository.findGroup2User(userid1, userid2);

        Group group = null;

        if (groupid == null) {
            // create group
            group = new Group();
            group.setType(EnumGroupType.IsUser.getId());
            group.setStatus(EnumStatus.ACTIVE.getValue());
            group.setCreateddate(new Date());
            group.setModifieddate(new Date());
            // save group
            group = groupRepository.save(group);

            // create user_group
            this.userGroupService.createUserGroup(List.of(userid1, userid2), group.getId());
        }
        else{
            group = this.groupRepository.findById(groupid).get();
        }

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(group)
                .enumResponse(EnumResponse.toJson(EnumResponse.CHECK_USER_GROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }

    @Transactional(rollbackOn = { Exception.class })
    public ResponseEntity seenMessage(String groupid, String authorizationHeader) {
        // get user id from authorizationHeader
        String userId = (String) userClient.getUserId(authorizationHeader);

        // update 
        this.groupRepository.updateSeenMessage(groupid, userId, new Date());

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.SEEN_MESSAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }
}
