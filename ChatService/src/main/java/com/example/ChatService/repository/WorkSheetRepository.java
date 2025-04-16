package com.example.ChatService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ChatService.entity.WorkSheet;

public interface WorkSheetRepository extends JpaRepository<WorkSheet, String> {
    // Define any custom query methods if needed
    
}
