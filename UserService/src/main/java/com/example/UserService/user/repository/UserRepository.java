package com.example.UserService.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.UserService.user.entity.User;
import com.example.UserService.user.model.UserSchedule;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE id IN (:ids)", nativeQuery = true)
    List<User> getListUser(List<String> ids);

    @Query(value = """
            SELECT * FROM users u 
            WHERE u.name LIKE CONCAT('%', :text, '%')
            OR u.studentid LIKE CONCAT('%', :text, '%')
            """, nativeQuery = true)
    List<User> searchText(String text);


    @Query(value = """
            SELECT * 
            FROM users u
            WHERE 
                CASE 
                    WHEN :type = 'major' THEN u.major
                    WHEN :type = 'faculty' THEN u.faculty
                    ELSE NULL
                END = :value
            """, nativeQuery = true)
    List<User> getListUser(String type, String value);

    @Query(value = """
            CALL get_top_10_matching_users(:userid)
            """, nativeQuery = true)
    List<UserSchedule> getListUserSchedule(String userid);

}
