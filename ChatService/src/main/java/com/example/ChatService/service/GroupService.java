package com.example.ChatService.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.RequestAddMember;
import com.example.ChatService.dto.RequestCreateGroup;
import com.example.ChatService.entity.Group;
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
}
