package com.example.FriendService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FriendService.entity.User;
import com.example.FriendService.mapper.FriendMapper;
import com.example.FriendService.repository.FriendRepository;

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
}
