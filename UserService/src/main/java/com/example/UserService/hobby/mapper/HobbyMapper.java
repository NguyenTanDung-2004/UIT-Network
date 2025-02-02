package com.example.UserService.hobby.mapper;

import com.example.UserService.hobby.dto.RequestCreate;
import com.example.UserService.hobby.entity.Hobby;

public class HobbyMapper {
    public static Hobby toEntity(RequestCreate requestCreate) {
        return Hobby.builder()
                .name(requestCreate.getName())
                .description(requestCreate.getDescription())
                .avtURL(requestCreate.getAvtURL())
                .build();
    }
}
