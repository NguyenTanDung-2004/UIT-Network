package com.example.ChatService.entity;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "GroupMessage")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    private String id;
    private String groupid;
    private String message;
    private Integer type;
    private Date createddate;
    private Date modifieddate;
    private String status;    
}
