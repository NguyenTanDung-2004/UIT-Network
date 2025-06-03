package com.example.ChatService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ChatService.entity.WorkSheet;

public interface WorkSheetRepository extends JpaRepository<WorkSheet, String> {

    @Query(value = "SELECT * FROM work_sheet WHERE groupid = :groupid AND status = 'ACTIVE' AND isparent = 1", nativeQuery = true)
    List<WorkSheet> findParents(String groupid);
    // Define any custom query methods if needed

    @Query(value = """
            select ws2.* from work_sheet ws1 inner join work_sheet ws2 on ws1.parentid = ws2.parentid
            where ws1.id = :id
            and ws1.status = 'ACTIVE'
            and ws2.status = 'ACTIVE'
            """, nativeQuery = true)
    List<WorkSheet> getWSDetail(String id);

    @Query(value = "SELECT * FROM work_sheet WHERE groupid = :groupid AND status = 'ACTIVE' AND isparent = 1", nativeQuery = true)
    List<WorkSheet> findListWSInGroup(String groupid);
    
}
