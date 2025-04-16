package com.example.ChatService.entity;

import java.util.Date;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "work_sheet")
@Builder
public class WorkSheet {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String groupid;
    private String userids; // list userids
    private Date fromdate;
    private Date todate; // added todate
    private Date createddate;
    private Date modifieddate;
    private String name;
    private String status;
    private String content;
    private String parentid;
    private Integer isparent;
    private Integer workstatus;
    private String createdbyuserid;
    private String modifiedbyuserid;
}
