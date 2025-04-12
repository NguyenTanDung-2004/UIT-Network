package com.example.ChatService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity createMessage(@RequestBody RequestCreateMessage requestCreateMessage, @RequestHeader("Authorization") String authorizationHeader) {
        return messageService.createMessage(requestCreateMessage, authorizationHeader);
    }

    @PostMapping("/AI")
    public ResponseEntity createAIMessage(@RequestBody RequestCreateAIMessage request, @RequestHeader("Authorization") String authorizationHeader) {
        return messageService.createAIMessage(request, authorizationHeader);
    }
}
