package com.example.UserService.mapper;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.UserService.hobby.service.HobbyService;
import com.example.UserService.role.service.RoleService;
import com.example.UserService.user.dto.request.RequestCreate;
import com.example.UserService.user.dto.request.RequestUpdateUserInfo;
import com.example.UserService.user.dto.response.ResponseExternalUserInfo;
import com.example.UserService.user.dto.response.ResponseUserInfo;
import com.example.UserService.user.entity.User;
import com.example.UserService.user.model.PrivateProperties;
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
                .privateProperties(0)
                .background(requestCreate.getBackground())
                .build();
    }

    public ResponseUserInfo toResponse(User user, HobbyService hobbyService) {
        return ResponseUserInfo.builder()
                .id(user.getId())
                .email(user.getPrivateProperties().equals(1) ? null : user.getEmail())
                .avtURL(user.getAvtURL())
                .name(user.getName())
                .description(user.getDescription())
                .studentID(user.getStudentID())
                .major(user.getPrivateProperties().equals(1) ? null : user.getMajor())
                .faculty(user.getPrivateProperties().equals(1) ? null : user.getFaculty())
                .phone(user.getPrivateProperties().equals(1) ? null : user.getPhone())
                .dob(user.getPrivateProperties().equals(1) ? null : user.getDob())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .jsonSchedule(user.getJsonSchedule())
                .hobbies(hobbyService.getUserHobbies(user.getId()))
                .background(user.getBackground())
                .build();
    }

    public void updateBasicInfo(RequestUpdateUserInfo requestUpdateUserInfo, User user) {
        Optional.ofNullable(requestUpdateUserInfo.getAvtURL()).ifPresent(user::setAvtURL);
        Optional.ofNullable(requestUpdateUserInfo.getName()).ifPresent(user::setName);
        Optional.ofNullable(requestUpdateUserInfo.getDescription()).ifPresent(user::setDescription);
        Optional.ofNullable(requestUpdateUserInfo.getPhone()).ifPresent(user::setPhone);
        Optional.ofNullable(requestUpdateUserInfo.getDob()).ifPresent(user::setDob);
        Optional.ofNullable(requestUpdateUserInfo.getLongitude()).ifPresent(user::setLongitude);
        Optional.ofNullable(requestUpdateUserInfo.getLatitude()).ifPresent(user::setLatitude);
        Optional.ofNullable(requestUpdateUserInfo.getBackground()).ifPresent(user::setBackground);
    }

    public ResponseExternalUserInfo toResponseExternalUserInfo(User user) {
        return ResponseExternalUserInfo.builder()
                .userId(user.getId())
                .avtURL(user.getAvtURL())
                .userName(user.getPrivateProperties().equals(1) ? null : user.getName())
                .studentId(user.getStudentID())
                .build();
    }
}
