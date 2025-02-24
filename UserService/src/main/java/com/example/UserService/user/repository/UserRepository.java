package com.example.UserService.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.UserService.user.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE id IN (:ids)", nativeQuery = true)
    List<User> getListUser(List<String> ids);

}
