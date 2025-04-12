package com.example.ChatService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
