package com.example.ChatService.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.ExternalUserInfo;
import com.example.ChatService.dto.RequestCallGeminiAPI;
import com.example.ChatService.dto.RequestCreateAIMessage;
import com.example.ChatService.dto.RequestCreateMessage;
import com.example.ChatService.dto.ResponseListMessage;
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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;

import feign.FeignException;
import feign.Response;
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

    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;


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
    public ResponseEntity createMessage(List<RequestCreateMessage> requestCreateMessage, String authorizationHeader) {
        // get user id from authorizationHeader
        String userId = getUserId(authorizationHeader);

        // check if this message is not in group
        EnumGroupType groupType = EnumGroupType.fromTypeId(requestCreateMessage.get(0).getGrouptype());

        String groupId = requestCreateMessage.get(0).getGroupid();

        switch (groupType) {
            case IsUser:
                // create groupid
                groupId = groupRepository.findGroup2User(userId, requestCreateMessage.get(0).getReceiverid());

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
                    this.userGroupService.createUserGroup(List.of(userId, requestCreateMessage.get(0).getReceiverid()), groupId);
                }

                break;

            case IsGroup:
        
            default:
                break;
        }

        // create message
        String parentid = UUID.randomUUID().toString(); // create parentid
        Map<String, Object> extraFields = Map.of("parentid", parentid, "senderid", userId); // create extra field

        // result 
        List<Message> listMessage = new ArrayList<>();
        
        for (int i = 0; i < requestCreateMessage.size(); i++) {
            Message message = (Message) messageMapper.toEntity(requestCreateMessage.get(i), extraFields);
            message.setGroupid(groupId); // set group id
            // save message
            message = messageRepository.save(message);
            listMessage.add(message);
        }

        this.messagingTemplate.convertAndSend("/topic/chat/message/" + groupId, listMessage);

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(listMessage)
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
        RequestCreateMessage requestCreateMessage1 = new RequestCreateMessage(request);
        requestCreateMessage1.setMessage(request.getQuestion());
        RequestCreateMessage requestCreateMessage2 = new RequestCreateMessage(request);
        requestCreateMessage2.setMessage(text);
        
        return createMessage(List.of(requestCreateMessage1, requestCreateMessage2), authorizationHeader);
    }

    public ResponseEntity getMessage(String groupid, String authorizationHeader) {
        // get user id from authorizationHeader
        String userId = getUserId(authorizationHeader);

        // get list  message
        List<Message> listMessage = messageRepository.findByGroupid(groupid);
        System.out.println(groupid);

        // result 
        List<ResponseListMessage> listResponse = new ArrayList<>();

        if (listMessage != null && listMessage.size() > 0) {
            // setup normal fields
            setupNormalFields(listMessage, listResponse);
            // setup isowner
            setupIsOwner(listResponse, userId);
            
            // create list userid (taged user and sender)
            String userids = createListUserids(listMessage);

            Map<String, ExternalUserInfo> map = new HashMap<>();

            if (userids.equals("") == false){
                Object listUserInfos = this.userClient.getListUserInfos(userids);
                List<ExternalUserInfo> externalUserInfos = new ObjectMapper().convertValue(listUserInfos, new TypeReference<List<ExternalUserInfo>>() {});
                externalUserInfos.stream().forEach(userinfo -> {
                   map.put(userinfo.getUserId(), userinfo); 
                });

                // set up name and avt
                setupNameAndURL(listResponse, map);

                // set up taged username and userid
                setupTagedUserIdUserName(listResponse, map);

            }
        }

        ApiResponse response = ApiResponse.builder()
                .object(listResponse)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_MESSAGE_SUCCESS))
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    private void setupNormalFields(List<Message> listMessage, List<ResponseListMessage> listResponse) {
        listMessage.stream().forEach(message -> {
            ResponseListMessage response = new ResponseListMessage(message);
            listResponse.add(response);
        });
    }

    private void setupIsOwner(List<ResponseListMessage> listResponse, String userId) {
        listResponse.stream().forEach(message -> {
            if (message.getSenderid().equals(userId)) {
                message.setIsowner(true);
            } else {
                message.setIsowner(false);
            }
        });
    }

    private void setTags(List<Message> listMessage, List<ResponseListMessage> listResponse) {
        List<String> tagids = new ArrayList<>();
        listMessage.stream().forEach(message -> {
            tagids.add(message.getTags());
        });


    }

    private String createListUserids(List<Message> messages){
        StringBuilder userids = new StringBuilder("");

        messages.stream().forEach(message -> {
            String senderid = message.getSenderid();

            if (senderid != null){
                userids.append(senderid);
                userids.append(",");
            }

            String tagids = message.getTags();
            if (message.getTags() != null){
                userids.append(tagids);
                userids.append(",");
            }
        });

        StringBuilder result = new StringBuilder("");

        if (userids.toString().equals("") == false){
            userids.deleteCharAt(userids.length() - 1);

            String[] array = userids.toString().split(",");
            // convert to list 
            Set<String> resultSet = new HashSet<>();
            for (int i = 0; i < array.length; i++){
                resultSet.add(array[i]);
            }
            // conver to String
            for (String item: resultSet){
                result.append(item);
                result.append(",");
            }

            result.deleteCharAt(result.length() - 1);
        }
        
        return result.toString();
    }

    private void setupNameAndURL(List<ResponseListMessage> messages, Map<String, ExternalUserInfo> map){
        messages.stream().forEach(message -> {
            String userid = message.getSenderid();
            if (userid != null){
                ExternalUserInfo userinfo = map.get(userid);
                message.setSendername(userinfo.getUserName());
                message.setAvturl(userinfo.getAvtURL());
            }
        });
    }

    private void setupTagedUserIdUserName(List<ResponseListMessage> messages, Map<String, ExternalUserInfo> map){
        messages.stream().forEach(message -> {
            if (message.getTags().size() > 0){
                for(int i = 0; i < message.getTags().size(); i++){
                    message.getTags().get(i).setName(map.get(message.getTags().get(i).getId()).getUserName() == null ? map.get(message.getTags().get(i).getId()).getStudentId() : map.get(message.getTags().get(i).getId()).getUserName());
                }
            }
        });
    }

    
}
