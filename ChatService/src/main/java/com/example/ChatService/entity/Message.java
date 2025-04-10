package com.example.ChatService.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "message")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String id;
    private String parentid;
    private String senderid;
    private String message; 
    private String tags;
    private Integer type; 
    private Date createddate;
    private Date modifieddate;
    private String status;
    private Integer pin;
}
