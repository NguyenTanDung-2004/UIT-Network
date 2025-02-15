package com.example.FanpageGroupService.entities;

import java.util.Date;

import jakarta.persistence.Column;
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
@Table(name = "study_groups")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String intro;
    private String phone;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String avtURL;

    @Column(columnDefinition = "TEXT")
    private String backgroundURL;

    private String createdUserId;

    private Date createdDate;

    private Date updatedDate;

    private Boolean isDelete;
    private Date deletedDate;
}
