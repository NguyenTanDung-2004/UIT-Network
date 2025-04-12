package com.example.ChatService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.ChatService.entity.Group;

public interface GroupRepository extends JpaRepository<Group, String> {

    @Query(value = 
    """
        SELECT g.id
        FROM chatgroup g 
            JOIN user_group ug
            ON g.id = ug.groupid
        WHERE g.type = 2
            AND ug.userid IN (:userid1, :userid2)
            AND g.status = 'ACTIVE'
            AND ug.status = 'ACTIVE'
        GROUP BY g.id
        HAVING count(*) = 2  
    """, nativeQuery = true)      
    String findGroup2User(String userid1, String userid2);

    @Modifying
    @Query(value = 
    """
        UPDATE user_group ug
        SET ug.status = 'DELETED'
        WHERE ug.groupid = :groupid
            AND ug.userid IN (:memberids)
            AND ug.status = 'ACTIVE'
    """, nativeQuery = true)
    void removeUserGroup(List<String> memberids, String groupid);
    
    
}