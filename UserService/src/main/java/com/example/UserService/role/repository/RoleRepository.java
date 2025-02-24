package com.example.UserService.role.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.UserService.role.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

}
