package com.example.UserService.hobby.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.hibernate.Session;
import org.springframework.stereotype.Service;

import com.example.UserService.hobby.entity.Hobby;
import com.example.UserService.hobby.repository.HobbyRepository;

import jakarta.persistence.EntityManager;

@Service
public class HobbyService {
    @Autowired
    private HobbyRepository hobbyRepository;

    @Autowired
    private EntityManager entityManager;

    public Set<Hobby> getUserHobbies(String userId) {
        return this.hobbyRepository.getUserHobbies(userId);
    }

    public Set<Long> getUserHobbyIds(String userId) {
        return this.hobbyRepository.getUserHobbyIds(userId);
    }

    public void insertUserHobbies(String userId, Set<Long> hobbyIds) {
        if (hobbyIds == null || hobbyIds.isEmpty()) {
            return;
        }

        String sql = "INSERT INTO user_hobby (user_id, hobby_id) VALUES (?, ?)";

        entityManager.unwrap(Session.class).doWork(connection -> {
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                for (Long hobbyId : hobbyIds) {
                    ps.setString(1, userId);
                    ps.setLong(2, hobbyId);
                    ps.addBatch();
                }
                ps.executeBatch();
            }
        });
    }
}
