package com.example.ChatService.entity;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "group")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Group {
    private String id;
    private Integer type;
    private String name;
    private String ownerid;
    private String status;
    private Date createddate;
    private Date modifieddate;
    private String avturl;
}
