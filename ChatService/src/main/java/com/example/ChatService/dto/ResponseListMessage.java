package com.example.ChatService.dto;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

import com.example.ChatService.entity.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseListMessage {
    private String id;
    private String parentid;
    private String senderid;
    private String message;
    private List<Tag> tags;
    private Integer type;
    private Date createddate;
    private Date modifieddate;
    private String status;
    private String groupid;
    private Boolean isowner;

    // user info
    private String avturl;
    private String sendername;

    public ResponseListMessage(Message message){
        this.id = message.getId();
        this.parentid = message.getParentid();
        this.senderid = message.getSenderid();
        this.message = message.getMessage();
        this.tags = new ArrayList<>();
        this.type = message.getType();
        this.createddate = message.getCreateddate();
        this.modifieddate = message.getModifieddate();
        this.status = message.getStatus();
        this.groupid = message.getGroupid();

        String tageduserids = message.getTags();

        if (tageduserids != null){
            String array[] = tageduserids.split(",");
            for (int i = 0; i < array.length; i++){
                Tag tag = new Tag(null, array[i]);
                tags.add(tag);
            }
        }
    }
}