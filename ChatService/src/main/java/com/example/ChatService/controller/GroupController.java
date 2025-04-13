package com.example.ChatService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ChatService.dto.RequestAddMember;
import com.example.ChatService.dto.RequestCreateGroup;
import com.example.ChatService.entity.Group;
import com.example.ChatService.service.GroupService;

@RestController
@RequestMapping("/chat/group")
public class GroupController {
    
    @Autowired
    private GroupService groupService;

    @PostMapping("")
    public ResponseEntity createGroup(@RequestBody RequestCreateGroup request, @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.createGroup(request, authorizationHeader);
    }

    @PostMapping("/members")
    public ResponseEntity addMembers(@RequestBody RequestAddMember request, @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.addMembers(request, authorizationHeader);
    }

    @DeleteMapping("/members")
    public ResponseEntity removeMembers(@RequestBody RequestAddMember request, @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.removeMembers(request, authorizationHeader);
    }

    @GetMapping("/isgroup/{userid1}/{userid2}")
    public ResponseEntity checkUserGroup(@PathVariable(name = "userid1") String userid1, @PathVariable(name = "userid2") String userid2) {
        return groupService.checkUserGroup(userid1, userid2);
    }

    @PutMapping("/seen/{groupid}")
    public ResponseEntity seenMessage(@PathVariable(name = "groupid") String groupid, @RequestHeader("Authorization") String authorizationHeader) {
        return groupService.seenMessage(groupid, authorizationHeader);
    }

    /*
     * this api is used to get list group of user
     * - groupid
     * - avt
     * - groupname
     * - seen
     */
    @GetMapping("/list")
    public ResponseEntity getListGroup(@RequestHeader("Authorization") String authorizationHeader) {
        return groupService.getListGroup(authorizationHeader);
    }
}
