package com.example.ChatService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ChatService.dto.worksheet.RequestCreateWorkSheet;
import com.example.ChatService.dto.worksheet.RequestUpdateWSParent;
import com.example.ChatService.service.WorkSheetService;

@RestController
@RequestMapping("/chat/worksheet")
public class WorkSheetController {
    @Autowired
    private WorkSheetService workSheetService;

    @PostMapping("")
    public ResponseEntity createWorkSheet(@RequestBody RequestCreateWorkSheet request, @RequestHeader("Authorization") String authorizationHeader) {
        return workSheetService.createWorkSheet(request, authorizationHeader);
    }

    @PutMapping("/parent")
    public ResponseEntity updateWorkSheet(@RequestBody RequestUpdateWSParent request, @RequestHeader("Authorization") String authorizationHeader) {
        return workSheetService.updateWorkSheet(request, authorizationHeader);
    }

}
