package com.example.ChatService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.RequestCreateMessage;
import com.example.ChatService.enums.EnumGroupType;
import com.example.ChatService.exception.EnumException;
import com.example.ChatService.exception.ExternalException;
import com.example.ChatService.exception.UserException;
import com.example.ChatService.repository.httpclient.UserClient;

import feign.FeignException;

@Service
public class MessageService {

    @Autowired
    private UserClient userClient;

    private String getUserId(String authorizationHeader) {
        // get userId
        String userId;
        try {
            userId = (String) userClient.getUserId(authorizationHeader);
        } catch (Exception e) {
            if (e instanceof FeignException) {
                throw new ExternalException((FeignException) e);
            } else {
                throw new UserException(EnumException.INTERNAL_ERROR);
            }
        }

        return userId;
    }

    public ResponseEntity createMessage(RequestCreateMessage requestCreateMessage, String authorizationHeader) {
        // get user id from authorizationHeader
        String userId = getUserId(authorizationHeader);

        // check if this message is not in group
        EnumGroupType groupType = EnumGroupType.fromTypeId(requestCreateMessage.getGrouptype());

        switch (groupType) {
            case IsUser:
                // check if group is exist
                break;

            case IsGroup:
        
            default:
                break;
        }


    }
    
}
