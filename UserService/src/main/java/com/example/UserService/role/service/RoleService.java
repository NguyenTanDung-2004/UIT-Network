package com.example.UserService.role.service;

import java.util.HashSet;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.UserService.role.entity.Role;
import com.example.UserService.role.repository.RoleRepository;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role createRole(int flag) {
        switch (flag) {
            case 1:
                return findRoleById(1L);
            case 2:
                return findRoleById(2L);
            case 3:
                return findRoleById(3L);
            default:
                return null;
        }
    }

    public Role findRoleById(Long id) {
        Optional<Role> optional = this.roleRepository.findById(id);

        return optional.get();
    }
}
