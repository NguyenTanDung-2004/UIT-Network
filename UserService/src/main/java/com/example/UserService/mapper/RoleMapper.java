package com.example.UserService.mapper;

import com.example.UserService.role.dto.RequestCreate;
import com.example.UserService.role.entity.Role;

public class RoleMapper {
    public static Role toEntity(RequestCreate requestCreate) {
        return Role.builder()
                .name(requestCreate.getName())
                .build();
    }
}
