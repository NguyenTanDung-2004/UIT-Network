package com.example.ChatService.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.hibernate.jdbc.Work;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.worksheet.RequestCreateWorkSheet;
import com.example.ChatService.dto.worksheet.RequestUpdateWSParent;
import com.example.ChatService.entity.WorkSheet;
import com.example.ChatService.enums.EnumStatus;
import com.example.ChatService.enums.EnumWorkSheetType;
import com.example.ChatService.mapper.Mapper;
import com.example.ChatService.repository.WorkSheetRepository;
import com.example.ChatService.repository.httpclient.UserClient;
import com.example.ChatService.response.ApiResponse;
import com.example.ChatService.response.EnumResponse;

import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkSheetService {

    @Autowired
    @Qualifier("workSheetMapper") // Replace 'specificMapperBeanName' with the actual bean name
    private Mapper mapper;

    @Autowired
    private WorkSheetRepository workSheetRepository;

    @Autowired
    private UserClient userClient;

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity createWorkSheet(RequestCreateWorkSheet request, String authorizationHeader) {
       // get user id from token
        String userId = (String) userClient.getUserId(authorizationHeader);
       
        // create parent id
        String parentId = UUID.randomUUID().toString();
        // create extrafied
        Map<String, Object> map = new HashMap<>();
        
        map.put("parentid", parentId);
        map.put("groupid", request.getGroupid());
        map.put("createdbyuserid", userId);
        map.put("modifiedbyuserid", userId);

        // convert request to entity 
        List<WorkSheet> list = new ArrayList<>();

        // create child
        request.getWorksinsheet().stream().forEach(item -> {
            WorkSheet workSheet = (WorkSheet) this.mapper.toEntity(item, map);
            list.add(workSheet);
        });

        // create parent 
        WorkSheet parent = WorkSheet.builder()
                .groupid(request.getGroupid())
                .isparent(EnumWorkSheetType.IS_PARENT.getId())
                .name(request.getName())
                .fromdate(request.getFromdate())
                .todate(request.getTodate())
                .status(EnumStatus.ACTIVE.getValue())
                .createdbyuserid(userId)
                .modifiedbyuserid(userId)
                .createddate(new Date())
                .modifieddate(new Date())
                .build();

        // add parent to list
        list.add(parent);
        
        // save to db
        this.workSheetRepository.saveAll(list);

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(list)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_WORKSHEET_SUCCESS))
                .build();
        
        return ResponseEntity.ok(response);
    }

    public ResponseEntity updateWorkSheet(RequestUpdateWSParent request, String authorizationHeader) {
        // get user id from token
        String userId = (String) userClient.getUserId(authorizationHeader);
        
        // find parent 
        WorkSheet parent = this.workSheetRepository.findById(request.getId()).get();

        // update 
        parent.setName(request.getName() == null ? parent.getName() : request.getName());
        parent.setFromdate(request.getFromdate() == null ? parent.getFromdate() : request.getFromdate());
        parent.setTodate(request.getTodate() == null ? parent.getTodate() : request.getTodate());
        parent.setModifiedbyuserid(userId);
        parent.setModifieddate(new Date());
        parent.setStatus(request.getStatus() == null ? parent.getStatus() : request.getStatus());

        // save to db
        parent = this.workSheetRepository.save(parent);
        

        ApiResponse response = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_WORKSHEET_SUCCESS))
                .build();
        
        return ResponseEntity.ok(response);
    }
    
}
