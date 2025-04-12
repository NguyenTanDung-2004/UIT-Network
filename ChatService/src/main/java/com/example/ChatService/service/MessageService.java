package com.example.ChatService.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.RequestCallGeminiAPI;
import com.example.ChatService.dto.RequestCreateAIMessage;
import com.example.ChatService.dto.RequestCreateMessage;
import com.example.ChatService.entity.Group;
import com.example.ChatService.entity.Message;
import com.example.ChatService.entity.UserGroup;
import com.example.ChatService.enums.EnumGroupType;
import com.example.ChatService.enums.EnumStatus;
import com.example.ChatService.exception.EnumException;
import com.example.ChatService.exception.ExternalException;
import com.example.ChatService.exception.UserException;
import com.example.ChatService.mapper.Mapper;
import com.example.ChatService.mapper.MessageMapper;
import com.example.ChatService.repository.GroupRepository;
import com.example.ChatService.repository.MessageRepository;
import com.example.ChatService.repository.httpclient.GeminiAPI;
import com.example.ChatService.repository.httpclient.UserClient;
import com.example.ChatService.response.ApiResponse;
import com.example.ChatService.response.EnumResponse;
import com.fasterxml.jackson.databind.json.JsonMapper;

import feign.FeignException;
import jakarta.transaction.Transactional;

@Service
public class MessageService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserGroupService userGroupService;

    @Autowired
    private Mapper messageMapper;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private GeminiAPI geminiAPI;


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

    @Transactional(rollbackOn = { Exception.class })
    public ResponseEntity createMessage(RequestCreateMessage requestCreateMessage, String authorizationHeader) {
        // get user id from authorizationHeader
        String userId = getUserId(authorizationHeader);

        // check if this message is not in group
        EnumGroupType groupType = EnumGroupType.fromTypeId(requestCreateMessage.getGrouptype());

        String groupId = requestCreateMessage.getGroupid();

        switch (groupType) {
            case IsUser:
                // create groupid
                groupId = groupRepository.findGroup2User(userId, requestCreateMessage.getReceiverid());

                if (groupId == null) {
                    // create group
                    Group group = new Group();
                    group.setId(groupId);
                    group.setType(EnumGroupType.IsUser.getId());
                    group.setStatus(EnumStatus.ACTIVE.getValue());
                    group.setCreateddate(new Date());
                    group.setModifieddate(new Date());
                    // save group
                    group = groupRepository.save(group);
                    groupId = group.getId();

                    // save user_group
                    this.userGroupService.createUserGroup(List.of(userId, requestCreateMessage.getReceiverid()), groupId);
                }

                break;

            case IsGroup:
        
            default:
                break;
        }

        // create message
        String parentid = UUID.randomUUID().toString(); // create parentid
        Map<String, Object> extraFields = Map.of("parentid", parentid, "senderid", userId); // create extra field
        Message message = (Message) messageMapper.toEntity(requestCreateMessage, extraFields);
        message.setGroupid(groupId); // set group id

        message = messageRepository.save(message); // save message

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(message)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_MESSAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }

    public ResponseEntity createAIMessage(RequestCreateAIMessage request, String authorizationHeader) {
        // create request call gemini API
        RequestCallGeminiAPI requestCall = new RequestCallGeminiAPI(request.getQuestion());

        Object object = this.geminiAPI.createAIMessage(requestCall);

        Map<String, Object> response = (Map<String, Object>) object;
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        Map<String, Object> firstCandidate = candidates.get(0);
        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        String text = (String) parts.get(0).get("text");

        // create requestCreateMessage
        RequestCreateMessage requestCreateMessage = new RequestCreateMessage(request);
        requestCreateMessage.setMessage(text);
        
        return createMessage(requestCreateMessage, authorizationHeader);
    }
    
}
