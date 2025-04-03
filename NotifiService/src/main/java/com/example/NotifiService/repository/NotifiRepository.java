package com.example.NotifiService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.NotifiService.model.ActionNotification;

@Repository
public interface NotifiRepository extends JpaRepository<ActionNotification, String> {
   
    
}
