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

@Entity
@Table(name = "chatgroup")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    private String id;
    private Integer type;
    private String name;
    private String ownerid;
    private String status;
    private Date createddate;
    private Date modifieddate;
    private String avturl;
}
