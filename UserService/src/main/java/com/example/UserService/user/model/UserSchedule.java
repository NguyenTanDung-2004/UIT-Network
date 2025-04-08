package com.example.UserService.user.model;

import com.example.UserService.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSchedule {
    private String id;
    private String name;
    private String avtURL;
    private String studentId;
    private String email;
    private String major;
    private String faculty;
    private Double overlap;
}
