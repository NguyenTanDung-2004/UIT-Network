package com.example.FanpageGroupService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.FanpageGroupService.entities.Fanpage;

public interface FanpageRepository extends JpaRepository<Fanpage, String> {

    @Modifying
    @Query(value = "INSERT INTO user_like_fanpage (user_id, fanpage_id) VALUES (:userId, :fanpageId)", nativeQuery = true)
    public void userReactFanpage(String userId, String fanpageId);
}
