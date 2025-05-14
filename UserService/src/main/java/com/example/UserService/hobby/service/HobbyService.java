package com.example.UserService.hobby.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.hibernate.Session;
import org.springframework.stereotype.Service;

import com.example.UserService.hobby.dto.HobbyDTO;
import com.example.UserService.hobby.entity.Hobby;
import com.example.UserService.hobby.mapper.HobbyMapper;
import com.example.UserService.hobby.repository.HobbyRepository;

import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HobbyService {
    @Autowired
    private HobbyRepository hobbyRepository;

    @Autowired
    private EntityManager entityManager;

    /*
     * The reason for putting code in synchronized block is that
     * - when we get list hobby from database (hibernate is tracking this list).
     * - when convert list to hashset (new thread access this list so the exception
     * will be thrown)
     */
    public Set<Hobby> getUserHobbies(String userId) {
        List<HobbyDTO> listDTO = this.hobbyRepository.getUserHobbies(userId);

        // convert to hobby
        List<Hobby> listHobby = new ArrayList<>();

        for (int i = 0; i < listDTO.size(); i++) {
            listHobby.add(HobbyMapper.toEntity(listDTO.get(i)));
        }

        return new HashSet<>(listHobby);
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

    public void deleteUserHobbies(String id) {
        String sql = "DELETE FROM user_hobby WHERE user_id = ?";

        entityManager.unwrap(Session.class).doWork(connection -> {
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setString(1, id);
                ps.executeUpdate();
            }
        });
    }
}
