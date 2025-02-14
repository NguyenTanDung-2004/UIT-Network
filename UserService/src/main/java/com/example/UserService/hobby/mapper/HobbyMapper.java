package com.example.UserService.hobby.mapper;

import org.springframework.stereotype.Component;

import com.example.UserService.hobby.dto.HobbyDTO;
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

    public static Hobby toEntity(HobbyDTO hobbyDTO) {
        return Hobby.builder()
                .id(hobbyDTO.getId())
                .name(hobbyDTO.getName())
                .description(hobbyDTO.getDescription())
                .avtURL(hobbyDTO.getAvtURL())
                .build();
    }
}
