package com.example.FriendService.entity;

import java.util.Date;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
    @Id
    private String id;

    private String name;
    private Date dob;
    private String studentId;
    private String major;
    private String faculty;
    private String phone;

    @Relationship(type = "FRIEND") // we can change the value
    Set<User> friends;
}
