package com.example.FanpageGroupService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FanpageGroupService.dto.request.RequestAcceptOrRemoveJoinGroup;
import com.example.FanpageGroupService.dto.request.RequestCreateGroup;
import com.example.FanpageGroupService.dto.request.RequestUpdateGroup;
import com.example.FanpageGroupService.service.GroupService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/group")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @PostMapping("")
    public ResponseEntity createGroup(@RequestBody RequestCreateGroup request,
            @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.createGroup(request, authorizationHeader);
    }

    @PutMapping("")
    public ResponseEntity updateGroup(@RequestBody RequestUpdateGroup request) {
        return groupService.updateGroup(request);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity deleteGroup(@PathVariable(name = "groupId") String groupId) {
        return groupService.deleteGroup(groupId);
    }

    @PostMapping("/{groupId}/join-request")
    public ResponseEntity requestToJoinGroup(@PathVariable(name = "groupId") String groupId,
            @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.requestToJoinGroup(groupId, authorizationHeader);
    }

    @GetMapping("/{groupId}/join-requests")
    public ResponseEntity getJoinRequests(@PathVariable(name = "groupId") String groupId) {
        return groupService.getJoinRequests(groupId);
    }

    @PostMapping("/{groupId}/join-requests")
    public ResponseEntity acceptJoinRequest(@PathVariable(name = "groupId") String groupId,
            @RequestBody RequestAcceptOrRemoveJoinGroup requestAcceptJoinGroup) {
        return groupService.acceptJoinRequest(groupId, requestAcceptJoinGroup);
    }

    @DeleteMapping("/{groupId}/join-requests")
    public ResponseEntity removeJoinRequest(@PathVariable(name = "groupId") String groupId,
            @RequestBody RequestAcceptOrRemoveJoinGroup requestAcceptJoinGroup) {
        return groupService.removeJoinRequest(groupId, requestAcceptJoinGroup);
    }

    /*
     * External APIs
     */

    @GetMapping("/{groupId}/is-member/{userId}")
    public ResponseEntity isMember(@PathVariable(name = "groupId") String groupId,
            @PathVariable(name = "userId") String userId) {
        return groupService.isMember(groupId, userId);
    }
}
