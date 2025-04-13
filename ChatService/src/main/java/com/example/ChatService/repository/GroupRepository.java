package com.example.ChatService.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.ChatService.dto.ResponseListGroup;
import com.example.ChatService.entity.Group;

import feign.Param;

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


    @Query(value = 
    """
        SELECT g.*
        FROM chatgroup g 
            JOIN user_group ug
            ON g.id = ug.groupid
        WHERE g.type = 2
            AND ug.userid = :userId
            AND ug.groupid = :groupid
            AND g.status = 'ACTIVE'
            AND ug.status = 'ACTIVE'
    """, nativeQuery = true)
    Group findGroup(String userId, String groupid);


    @Modifying
    @Query(value = 
    """
        UPDATE user_group ug
        SET ug.seendate = :date
        WHERE ug.groupid = :groupid
            AND ug.userid = :userId
            AND ug.status = 'ACTIVE'
    """, nativeQuery = true)
    void updateSeenMessage(String groupid, String userId, Date date);

    @Query(value = 
        """
            SELECT 
                g.id, 
                g.type, 
                g.name, 
                g.ownerid, 
                g.status, 
                g.createddate, 
                g.modifieddate, 
                g.avturl,

                -- Fix: LIMIT 1 to ensure subquery returns only one row
                CASE 
                    WHEN g.type = 2
                        THEN (
                            SELECT ug1.userid 
                            FROM user_group ug1
                            WHERE ug1.groupid = g.id
                            AND ug1.userid <> :userId
                            LIMIT 1
                        )
                    ELSE NULL
                END AS otheruserid,

                -- Fix: CAST to ensure returns Integer, not BIGINT
                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM message m WHERE m.groupid = g.id
                    ) THEN CAST(1 AS SIGNED)
                    ELSE CAST(0 AS SIGNED)
                END AS isdisplay,

                -- Fix: All values explicitly cast to SIGNED (MySQL Integer)
                CASE 
                    WHEN ug.seendate IS NULL THEN
                        CASE 
                            WHEN EXISTS (
                                SELECT 1 FROM message m WHERE m.groupid = g.id
                            ) THEN CAST(0 AS SIGNED)
                            ELSE CAST(1 AS SIGNED)
                        END
                    WHEN ug.seendate >= (
                        SELECT MAX(m.createddate) 
                        FROM message m 
                        WHERE m.groupid = g.id
                    ) THEN CAST(1 AS SIGNED)
                    ELSE CAST(0 AS SIGNED)
                END AS isseen

            FROM 
                user_group ug
            JOIN 
                chatgroup g ON ug.groupid = g.id
            WHERE 
                ug.userid = :userId
                AND ug.status = 'ACTIVE'
                AND g.status = 'ACTIVE'
        """, nativeQuery = true)
    List<Object[]> findListGroup(@Param("userId") String userId);

    
    
}