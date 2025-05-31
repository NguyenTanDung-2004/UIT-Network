package com.example.NotifiService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.NotifiService.model.ActionNotification;

import feign.Param;

@Repository
public interface NotifiRepository extends JpaRepository<ActionNotification, String> {

    @Query(value = "SELECT id, createdid, message, date, receivedid, postid FROM action_notifications WHERE receivedid = :userId", nativeQuery = true)
    List<ActionNotification> getListNotification(@Param("userId") String userId);

    
   
    
}
