package com.example.ChatService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ChatService.entity.GroupMessage;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, String> {
   
    
}
