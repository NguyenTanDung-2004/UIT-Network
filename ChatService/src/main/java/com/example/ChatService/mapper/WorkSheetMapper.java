package com.example.ChatService.mapper;

import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.ChatService.dto.worksheet.RequestCreateWorkSheet;
import com.example.ChatService.dto.worksheet.WorkInSheet;
import com.example.ChatService.entity.WorkSheet;
import com.example.ChatService.enums.EnumStatus;
import com.example.ChatService.enums.EnumWorkSheetType;

@Component("workSheetMapper")
public class WorkSheetMapper implements Mapper {

    @Override
    public Object toEntity(Object from, Map<String, Object> extraFields) {
        WorkInSheet request = (WorkInSheet) from;

        return WorkSheet.builder()
                .groupid((String) extraFields.get("groupid"))
                .userids(request.getUserids())
                .fromdate(request.getFromddate()) // updated to fromdate
                .todate(request.getTodate()) // updated to todate
                .createddate(new Date())
                .modifieddate(new Date())
                .status(EnumStatus.ACTIVE.getValue())
                .content(request.getContent())
                .parentid((String) extraFields.get("parentid"))
                .isparent(EnumWorkSheetType.IS_WORK.getId())
                .workstatus(request.getWorkstatus())
                .createdbyuserid((String) extraFields.get("createdbyuserid"))
                .modifiedbyuserid((String) extraFields.get("modifiedbyuserid"))
                .build();
    }
    
}
