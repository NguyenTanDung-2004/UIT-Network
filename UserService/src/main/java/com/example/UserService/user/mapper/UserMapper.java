package com.example.UserService.user.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.UserService.role.service.RoleService;
import com.example.UserService.user.dto.request.RequestCreate;
import com.example.UserService.user.entity.User;
import com.example.UserService.user.service.PasswordService;

import lombok.experimental.FieldDefaults;

@Component
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserMapper {
    @Autowired
    PasswordService passwordService;

    @Value("${user.defaultavt}")
    String defaultUserAVT;

    @Autowired
    private RoleService roleService;

    public User toEntity(RequestCreate requestCreate) {
        return User.builder()
                .email(requestCreate.getEmail())
                .password(passwordService.hashPassword(requestCreate.getPassword()))
                .avtURL(defaultUserAVT)
                .name(requestCreate.getName())
                .role(roleService.createRole(requestCreate.getFlagRole()))
                .description(requestCreate.getDescription())
                .studentID(requestCreate.getStudentID())
                .major(requestCreate.getMajor())
                .faculty(requestCreate.getFaculty())
                .phone(requestCreate.getPhone())
                .dob(requestCreate.getDob())
                .latitude(requestCreate.getLatitude())
                .longitude(requestCreate.getLongitude())
                .build();
    }
}
