package com.example.UserService.role.service;

import org.springframework.stereotype.Service;

import com.example.UserService.role.entity.Role;

@Service
public class RoleService {
    public Role createRole(int flag) {
        switch (flag) {
            case 1:
                return new Role(1L, "STUDENT");
            case 2:
                return new Role(2L, "UNIVERSITY");
            case 3:
                return new Role(3L, "CLUB");
            default:
                return null;
        }
    }
}
