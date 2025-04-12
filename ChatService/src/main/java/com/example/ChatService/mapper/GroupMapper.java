package com.example.ChatService.mapper;

import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.ChatService.dto.RequestCreateGroup;
import com.example.ChatService.entity.Group;
import com.example.ChatService.enums.EnumStatus;

@Component
public class GroupMapper implements Mapper {

    @Override
    public Object toEntity(Object from, Map<String, Object> extraFields) {
        RequestCreateGroup request = (RequestCreateGroup) from;

        return Group.builder()
                .name(request.getName())
                .createddate(new Date())
                .modifieddate(new Date())
                .type(1)
                .ownerid((String) extraFields.get("ownerid"))
                .status(EnumStatus.ACTIVE.getValue())
                .avturl(request.getAvturl())
                .build();
    }    
}
