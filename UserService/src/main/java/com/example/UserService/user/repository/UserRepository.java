package com.example.UserService.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.UserService.user.entity.User;
import com.example.UserService.user.model.RecommendationUser;

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
    List<RecommendationUser> getListUserSchedule(String userid);

    @Query(value = """
        SELECT u.id, u.name, u.avturl, u.studentid, u.email, u.major, u.faculty,
        (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(u.latitude)) *
                cos(radians(u.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(u.latitude))
            )
        ) AS data
        FROM users u
        WHERE u.id != :userId
        HAVING data <= 20
        ORDER BY data ASC
        LIMIT 10
    """, nativeQuery = true)
    List<RecommendationUser> getUserByLocation(String userId, Double lat, Double lng);


    @Query(value = """
        SELECT u.id, u.name, u.avturl, u.studentid, u.email, u.major, u.faculty, 0 AS data
        FROM users u
        WHERE u.id IN (:userIds)
        """, nativeQuery = true)
    List<RecommendationUser> getListUserByIds(@Param("userIds") List<String> userIds);

    @Query(value = """
        SELECT u.id, 
            u.name, 
            u.avturl, 
            u.studentid, 
            u.email, 
            u.major, 
            u.faculty,
            COUNT(*) AS data
        FROM user_hobby uh1
        JOIN user_hobby uh2 
            ON uh1.hobby_id = uh2.hobby_id
        JOIN users u 
            ON u.id = uh2.user_id
        WHERE uh1.user_id = :userid
        AND uh2.user_id != uh1.user_id
        GROUP BY u.id, u.name, u.email
        ORDER BY data DESC
        LIMIT 10;
    """, nativeQuery = true)
    List<RecommendationUser> getListRecommendHobby(String userid);


    @Query(value = "INSERT INTO ", nativeQuery = true)
    public void createUserHobby(String userid, String hobbyid);
}
