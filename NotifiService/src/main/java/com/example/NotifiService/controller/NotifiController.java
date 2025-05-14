package com.example.NotifiService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.NotifiService.service.NotifiService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/notify")
public class NotifiController {
    @Autowired
    private NotifiService notifiService;

    @GetMapping("/{userId}")
    public ResponseEntity getListNotifications(@PathVariable(name = "userId") String userId) {
        return notifiService.getListNotifications(userId);
    }
}
