package com.example.PostService.mapper;

import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;

@Component
public interface Mapper {
    public Object toEntity(Object object1, Object object2);
}
