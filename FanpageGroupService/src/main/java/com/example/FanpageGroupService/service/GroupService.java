package com.example.FanpageGroupService.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.FanpageGroupService.dto.request.RequestCreateGroup;
import com.example.FanpageGroupService.dto.request.RequestUpdateGroup;
import com.example.FanpageGroupService.entities.Group;
import com.example.FanpageGroupService.exception.EnumException;
import com.example.FanpageGroupService.exception.ExternalException;
import com.example.FanpageGroupService.exception.UserException;
import com.example.FanpageGroupService.mapper.FanpageMapper;
import com.example.FanpageGroupService.mapper.GroupMapper;
import com.example.FanpageGroupService.mapper.Mapper;
import com.example.FanpageGroupService.repository.GroupRepository;
import com.example.FanpageGroupService.repository.httpclient.UserClient;
import com.example.FanpageGroupService.response.ApiResponse;
import com.example.FanpageGroupService.response.EnumResponse;

import feign.FeignException;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    private final Mapper mapper;

    @Autowired
    private UserClient userClient;

    @Autowired
    private GroupService(GroupMapper groupMapper) {
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
}
