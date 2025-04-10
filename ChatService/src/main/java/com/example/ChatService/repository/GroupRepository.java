package com.example.ChatService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ChatService.entity.Group;

public interface GroupRepository extends JpaRepository<Group, String> {
    // Custom query methods can be defined here if needed
    // For example, to find groups by a specific attribute
    // List<Group> findByAttribute(String attribute);
    
}
