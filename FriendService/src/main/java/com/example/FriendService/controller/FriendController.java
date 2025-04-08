package com.example.FriendService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FriendService.service.FriendService;

@RestController
@RequestMapping("/friend")
public class FriendController {
    @Autowired
    private FriendService friendService;

    @KafkaListener(topics = "user-creation", groupId = "friend-group")
    public void addUser(String message) {
        friendService.createUser(message);
    }

    @PostMapping("/{senderId}/request/{receiverId}")
    public ResponseEntity requestAddFriend(@PathVariable(name = "senderId") String senderId,
            @PathVariable(name = "receiverId") String receiverId) {
        return friendService.requestAddFriend(senderId, receiverId);
    }

    @DeleteMapping("/{senderId}/request/{receiverId}")
    public ResponseEntity cancelRequestFriend(@PathVariable(name = "senderId") String senderId,
            @PathVariable(name = "receiverId") String receiverId) {
        return friendService.cancelRequestFriend(senderId, receiverId);
    }

    @PostMapping("/{senderId}/friend/{receiverId}")
    public ResponseEntity acceptFriend(@PathVariable(name = "senderId") String senderId,
            @PathVariable(name = "receiverId") String receiverId) {
        return friendService.acceptFriend(senderId, receiverId);
    }

    @DeleteMapping("/{senderId}/friend/{receiverId}")
    public ResponseEntity deleteFriend(@PathVariable(name = "senderId") String senderId,
            @PathVariable(name = "receiverId") String receiverId) {
        return friendService.deleteFriend(senderId, receiverId);
    }

    /*
     * External APIs
     */
    @GetMapping("/is-friend/{userId1}/{userId2}")
    public ResponseEntity isFriend(@PathVariable(name = "userId1") String userId1,
            @PathVariable(name = "userId2") String userId2) {
        return friendService.isFriend(userId1, userId2);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity getListFriend(@PathVariable(name = "userId") String userId) {
        return friendService.getListFriend(userId);
    }

    @GetMapping("/mutual-friend/list/{userId}")
    public ResponseEntity getListMutualFriend(@PathVariable(name = "userId") String userId) {
        return friendService.getListMutualFriend(userId);
    }
}
