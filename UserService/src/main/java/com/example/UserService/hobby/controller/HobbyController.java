package com.example.UserService.hobby.controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.UserService.hobby.dto.RequestCreate;
import com.example.UserService.hobby.entity.Hobby;
import com.example.UserService.hobby.mapper.HobbyMapper;
import com.example.UserService.hobby.repository.HobbyRepository;

@RestController
@RequestMapping("/hobby")
public class HobbyController {
    @Autowired
    private HobbyRepository hobbyRepository;

    @PostMapping("/create")
    public ResponseEntity createHobby(@RequestBody List<RequestCreate> requestCreate) {
        for (int i = 0; i < requestCreate.size(); i++) {
            Hobby hobby = HobbyMapper.toEntity(requestCreate.get(i));
            hobbyRepository.save(hobby);
        }
        return ResponseEntity.ok("ok");
    }

    @GetMapping("")
    public ResponseEntity getAllHobby() {
        List<Hobby> listHobby = hobbyRepository.findAll();
        return ResponseEntity.ok(listHobby);
    }
}
