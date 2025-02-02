package com.example.UserService.role.controller;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.UserService.role.dto.RequestCreate;
import com.example.UserService.role.entity.Role;
import com.example.UserService.role.mapper.RoleMapper;
import com.example.UserService.role.repository.RoleRepository;

@RestController
@RequestMapping("/role")
public class RoleController {
    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/create")
    public ResponseEntity create(@RequestBody RequestCreate requestCreate) {
        // convert requestCreate to entity
        Role role = RoleMapper.toEntity(requestCreate);

        // check name
        if (roleRepository.findByName(role.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Role name already exists");
        }

        // save entity to database
        role = roleRepository.save(role);

        // return
        return ResponseEntity.ok(role);
    }
}
