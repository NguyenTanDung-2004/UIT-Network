package com.example.FriendService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.FriendService.entity.User;
import com.example.FriendService.mapper.FriendMapper;
import com.example.FriendService.repository.FriendRepository;
import com.example.FriendService.response.ApiResponse;
import com.example.FriendService.response.EnumResponse;

@Service
public class FriendService {
    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private FriendMapper firnedFriendMapper;

    public void createUser(String message) {
        // update message
        /*
         * The reason for updating message
         * Example: abc when push to kafka the value will be change to "abc"
         */
        message = message.replaceAll("\"", "");

        // convert message to notification model
        String[] parts = message.split("\\|\\|");

        // convert to user
        User user = firnedFriendMapper.messageToUser(parts);

        // save
        this.friendRepository.save(user);
    }

    public ResponseEntity requestAddFriend(String senderId, String receiverId) {
        this.friendRepository.sendFriendRequest(senderId, receiverId);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.REQUEST_TO_ADDFRIEND))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity cancelRequestFriend(String senderId, String receiverId) {
        this.friendRepository.cancelFriendRequest(senderId, receiverId);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.REQUEST_TO_ADDFRIEND))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity acceptFriend(String senderId, String receiverId) {
        this.friendRepository.acceptFriendRequest(senderId, receiverId);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.ACCEPT_REQUEST_ADDFRIEND))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity deleteFriend(String senderId, String receiverId) {
        this.friendRepository.removeFriend(senderId, receiverId);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.REMOVE_REQUEST_ADDFRIEND))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public ResponseEntity isFriend(String userId1, String userId2) {
        int isFriend = this.friendRepository.isFriend(userId1, userId2);

        return ResponseEntity.ok(isFriend);
    }
}
