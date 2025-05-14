package com.example.ChatService.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * this class is used to represent for group on the right bar on UI
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class GroupChatUIHome {
    private String id;
    private Integer type;
    private String name;
    private String ownerid;
    private String status;
    private Date createddate;
    private Date modifieddate;
    private String avturl;
    private String userid;
}
