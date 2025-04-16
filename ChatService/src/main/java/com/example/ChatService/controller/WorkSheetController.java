package com.example.ChatService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ChatService.dto.worksheet.RequestCreateWorkSheet;
import com.example.ChatService.dto.worksheet.RequestUpdateWSParent;
import com.example.ChatService.dto.worksheet.UpdateWSChild;
import com.example.ChatService.service.WorkSheetService;

import jakarta.websocket.server.PathParam;

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

    @PutMapping("/child")
    public ResponseEntity updateWorkSheetChild(@RequestBody List<UpdateWSChild> request, @RequestHeader("Authorization") String authorizationHeader) {
        return workSheetService.updateWorkSheetChild(request, authorizationHeader);
    }

    @GetMapping("/{wsid}")
    public ResponseEntity getWorkSheet(@RequestHeader("Authorization") String authorizationHeader, @PathVariable(value = "wsid") String wsid) {
        return workSheetService.getWorkSheet(authorizationHeader, wsid);
    }

    @GetMapping("/{wsid}/detail")
    public ResponseEntity getWorkSheetDetail(@RequestHeader("Authorization") String authorizationHeader, @PathVariable(value = "wsid") String wsid) {
        return workSheetService.getWorkSheetDetail(authorizationHeader, wsid);
    }

}
