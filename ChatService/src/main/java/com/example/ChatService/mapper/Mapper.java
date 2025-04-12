package com.example.ChatService.mapper;

import java.util.Map;

import org.springframework.stereotype.Component;
@Component
public interface Mapper {
    public Object toEntity(Object from, Map<String, Object> extraFields);
}
