package com.example.ChatService.mapper;

import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.ChatService.dto.RequestCreateMessage;
import com.example.ChatService.entity.Message;
import com.example.ChatService.enums.EnumStatus;

@Component("messageMapper")
public class MessageMapper implements Mapper{

    @Override
    public Object toEntity(Object from, Map<String, Object> extraFields) {
        RequestCreateMessage request = (RequestCreateMessage) from;

        Message message = Message.builder()
                .parentid((String) extraFields.get("parentid"))
                .senderid((String) extraFields.get("senderid"))
                .message(request.getMessage())
                .tags(request.getTags())
                .type(request.getMessagetype())
                .createddate(new Date())
                .modifieddate(new Date())
                .status(EnumStatus.ACTIVE.getValue())
                .pin(0)
                .build();
        
        return message;
    }
    
}
