package com.example.ChatService.entity;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_group")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGroup {
    private String id;
    private String userid;
    private String groupid;
    private String status;
    private Date createddate;
    private Date modifieddate;
}
