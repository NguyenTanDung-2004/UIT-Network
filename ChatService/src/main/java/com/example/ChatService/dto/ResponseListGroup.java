package com.example.ChatService.dto;

import java.util.Date;

import com.example.ChatService.entity.Group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
    /*
     * this api is used to get list group of user
     * - groupid
     * - avt
     * - groupname
     * - seen
     */
public class ResponseListGroup {
    // BEGIN GROUP
    private String id;
    private Integer type;
    private String name;
    private String ownerid;
    private String status;
    private Date createddate;
    private Date modifieddate;
    private String avturl;
    // END GROUP

    private String otheruserid;
    private Integer isdisplay;
    private Integer isseen;
}
