package com.example.UserService.hobby.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.UserService.hobby.entity.Hobby;

public interface HobbyRepository extends JpaRepository<Hobby, Long> {
    @Query(value = "select hb.* from hobbies hb\n" + //
            "\tjoin user_hobby us_hb on hb.id = us_hb.hobby_id\n" + //
            "    join users on users.id = us_hb.user_id\n" + //
            "where users.id = :userId", nativeQuery = true)
    Set<Hobby> getUserHobbies(String userId);

    @Query(value = "select us_hb.hobby_id \n" + //
            "from user_hobby us_hb \n" + //
            "where us_hb.user_id = :userId ", nativeQuery = true)
    Set<Long> getUserHobbyIds(String userId);

    @Query(value = ":value", nativeQuery = true)
    public void insertUserHobbies(String value);
}
