package com.example.ChatService.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ChatService.entity.UserGroup;
import com.example.ChatService.enums.EnumStatus;
import com.example.ChatService.repository.UserGroupRepository;

import jakarta.transaction.Transactional;

@Service
public class UserGroupService {

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Transactional(rollbackOn = { Exception.class })
    public void createUserGroup(List<String> userIds, String groupid){
        for (int i = 0; i < userIds.size(); i++){
            UserGroup userGroup = UserGroup.builder()
                    .userid(userIds.get(i))
                    .groupid(groupid)
                    .status(EnumStatus.ACTIVE.getValue())
                    .createddate(new Date())
                    .modifieddate(new Date())
                    .build();
            // save userGroup to database
            this.userGroupRepository.save(userGroup);
        }
    }
}
