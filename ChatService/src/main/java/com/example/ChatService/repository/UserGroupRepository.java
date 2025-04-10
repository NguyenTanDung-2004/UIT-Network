package com.example.ChatService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ChatService.entity.UserGroup;

public interface UserGroupRepository extends JpaRepository<UserGroup, String> {
    // Custom query methods can be defined here if needed
    // For example, to find user groups by a specific attribute
    // List<UserGroup> findByAttribute(String attribute);
    
}
