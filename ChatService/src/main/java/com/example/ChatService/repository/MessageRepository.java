package com.example.ChatService.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ChatService.entity.Message;
public interface MessageRepository extends JpaRepository<Message, String> {

    @Query("SELECT m FROM Message m WHERE m.groupid = :groupid")
    List<Message> findByGroupid(String groupid);

    
}
