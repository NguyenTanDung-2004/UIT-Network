package com.example.FanpageGroupService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.FanpageGroupService.entities.Group;
import com.example.FanpageGroupService.entities.user_group.UserGroup;
import com.example.FanpageGroupService.entities.user_group.UserGroupPK;

public interface UserGroupRepository extends JpaRepository<UserGroup, UserGroupPK> {

        @Query(value = "select * from user_group\n" + //
                        "where group_id = :groupId\n" + //
                        "\tand accepted = :accepted", nativeQuery = true)
        public List<UserGroup> getRequestedUsers(String groupId, Boolean accepted);

        @Modifying
        @Query(value = "update user_group as t\n" + //
                        "set t.accepted = true\n" + //
                        "where t.group_id = :groupId and t.user_id = :userId", nativeQuery = true)
        public void acceptJoinRequest(String groupId, String userId);

        @Modifying
        @Query(value = """
                        delete from user_group as t
                        where t.group_id = :groupId and t.user_id = :userId
                        """, nativeQuery = true)
        public void removeJoinRequest(String groupId, String userId);

        @Query(value = """
                        select case
                        	when exists (select 1 from user_group where user_id = :userId)
                        	then 1
                        	else 0
                        end as result
                                                """, nativeQuery = true)
        public int isMember(String userId);

        @Query(value = """
                        select group_id from user_group
                        where user_id = :userId and accepted = true
                        """, nativeQuery = true)
        public List<String> getListGroup(String userId);

        @Query(value = """
                        SELECT sg.* 
                        FROM study_groups sg JOIN user_group ug 
                                ON sg.id = ug.group_id
                        WHERE ug.accepted = true 
                                AND ug.user_id = :userId
                                                """, nativeQuery = true)
        public List<Group> getListGroupByUserId(String userId);

        @Query(value = """
                        select case
                        	when exists (select 1 from user_group where user_id = :userId and group_id = :groupId)
                        	then 1
                        	else 0
                        end as result
                                                """, nativeQuery = true)
        public int isMemberOfGroup(String userId, String groupId);

        @Query(value = """
                        select count(*) from user_group
                        where group_id = :groupid and accepted = true
                        """, nativeQuery = true)
        public int getNumberMember(String groupid);

        @Query(value = """
                        select ug.* from user_group ug
                        where ug.group_id = :groupid
                        """, nativeQuery = true)
        public List<UserGroup> getListMember(String groupid);

        @Query(value = """
                        select case
                        	when exists (select 1 from user_group where group_id = :groupId and user_id = :userId and is_admin = true)
                        	then 1
                        	else 0
                        end as result
                                                """, nativeQuery = true)
        public Boolean isMember(String userid, String groupId); 
}
