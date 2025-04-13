package com.example.ChatService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ChatService.dto.RequestCreateAIMessage;
import com.example.ChatService.dto.RequestCreateMessage;
import com.example.ChatService.service.MessageService;

@RestController
@RequestMapping("/chat/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("")
    public ResponseEntity createMessage(@RequestBody List<RequestCreateMessage> request, @RequestHeader("Authorization") String authorizationHeader) {
        return messageService.createMessage(request, authorizationHeader);
    }

    @PostMapping("/AI")
    public ResponseEntity createAIMessage(@RequestBody RequestCreateAIMessage request, @RequestHeader("Authorization") String authorizationHeader) {
        return messageService.createAIMessage(request, authorizationHeader);
    }

    @GetMapping("/{groupid}")
    public ResponseEntity getMessage(@RequestHeader("Authorization") String authorizationHeader, @RequestBody String groupid) {
        return messageService.getMessage(groupid, authorizationHeader);
    }
}
