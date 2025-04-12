package com.example.ChatService.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "message")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    private String id;
    private String parentid;
    private String senderid;
    private String message; 
    private String tags;
    private Integer type; 
    private Date createddate;
    private Date modifieddate;
    private String status;
    private String groupid;
    private Integer pin; // 0: not pinned, 1: pinned
}
