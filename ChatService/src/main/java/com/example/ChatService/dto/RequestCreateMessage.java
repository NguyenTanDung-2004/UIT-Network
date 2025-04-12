package com.example.ChatService.dto;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreateMessage {
    private String receiverid; // if it is not from group, we need to attached other user
    private String message; // convert from json to string if it is file
    private String tags;
    private String groupid;
    private Integer messagetype;
    private Integer grouptype;

    public RequestCreateMessage(RequestCreateAIMessage requestCreateAIMessage) {
        this.receiverid = requestCreateAIMessage.getReceiverid();
        this.message = requestCreateAIMessage.getQuestion();
        this.tags = requestCreateAIMessage.getTags();
        this.groupid = requestCreateAIMessage.getGroupid();
        this.messagetype = requestCreateAIMessage.getMessagetype();
        this.grouptype = requestCreateAIMessage.getGrouptype();
    }
}
