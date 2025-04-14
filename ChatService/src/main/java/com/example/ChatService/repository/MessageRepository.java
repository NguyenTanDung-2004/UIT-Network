package com.example.ChatService.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ChatService.entity.Message;
public interface MessageRepository extends JpaRepository<Message, String> {

    @Query(value = "SELECT * FROM message m WHERE m.groupid = :groupid ORDER BY m.createddate DESC", nativeQuery = true)
    List<Message> findByGroupid(String groupid);

    
}
