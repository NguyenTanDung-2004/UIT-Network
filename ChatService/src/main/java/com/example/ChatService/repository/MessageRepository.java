package com.example.ChatService.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ChatService.entity.Message;
public interface MessageRepository extends JpaRepository<Message, String> {

    
}
