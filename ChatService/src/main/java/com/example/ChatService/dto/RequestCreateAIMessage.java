package com.example.ChatService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCreateAIMessage {
    private String receiverid; // if it is not from group, we need to attached other user
    private String question; // convert from json to string if it is file
    private String tags;
    private String groupid;
    private Integer messagetype;
    private Integer grouptype;
}
