package com.example.ChatService.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.RequestCreateGroup;
import com.example.ChatService.entity.Group;
import com.example.ChatService.mapper.GroupMapper;
import com.example.ChatService.repository.GroupRepository;
import com.example.ChatService.repository.httpclient.UserClient;
import com.example.ChatService.response.ApiResponse;
import com.example.ChatService.response.EnumResponse;

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
}
