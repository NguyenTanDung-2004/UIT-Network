package com.example.ChatService.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ChatService.dto.RequestCreateAIMessage;
import com.example.ChatService.dto.RequestCreateMessage;
import com.example.ChatService.service.MessageService;

import jakarta.websocket.server.PathParam;

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
    public ResponseEntity getMessage(@RequestHeader("Authorization") String authorizationHeader, @PathVariable(name = "groupid") String groupid) {
        return messageService.getMessage(groupid, authorizationHeader);
    }

    /*
     * Test 
     */
     @Autowired
    private SimpMessagingTemplate messagingTemplate; // Inject SimpMessagingTemplate
    @GetMapping("/test")
    public String test() {
        Map<String, Object> datas = new HashMap<>();
        datas.put("message", "Hello, this is a test message!");
        datas.put("user", "Test User");
        messagingTemplate.convertAndSend("/topic/like-notification/ac99377b-e74f-4fa6-855a-778eb6b223ba", datas);
        return "ok";
    }
}
