package com.example.UserService.hobby.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.UserService.hobby.entity.Hobby;

public interface HobbyRepository extends JpaRepository<Hobby, Long> {

}
