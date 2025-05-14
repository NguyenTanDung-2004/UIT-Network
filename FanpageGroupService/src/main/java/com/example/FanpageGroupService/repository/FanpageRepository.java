package com.example.FanpageGroupService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.FanpageGroupService.entities.Fanpage;

public interface FanpageRepository extends JpaRepository<Fanpage, String> {

    @Modifying
    @Query(value = "INSERT INTO user_like_fanpage (user_id, fanpage_id) VALUES (:userId, :fanpageId)", nativeQuery = true)
    public void userReactFanpage(String userId, String fanpageId);

    @Query(value = "SELECT fanpage_id FROM user_like_fanpage WHERE user_id = :userId", nativeQuery = true)
    public List<String> getListFanpageUserLiked(String userId);

    @Query(value = "SELECT * FROM fanpage WHERE id IN (:ids)", nativeQuery = true)
    public List<Fanpage> getListFanpageInfos(String ids);

    @Query(value = """
            SELECT f.* 
            FROM fanpage f JOIN user_like_fanpage uf 
                    ON f.id = uf.fanpage_id
            WHERE uf.user_id = :userId
                                                """, nativeQuery = true)
    public List<Fanpage> getListFanpageNotExternal(String userId);

    @Query(value = "SELECT * FROM fanpage WHERE name LIKE %:text%", nativeQuery = true)
    public List<Fanpage> searchFanpage(String text);

    @Query(value = "SELECT COUNT(*) FROM user_like_fanpage WHERE fanpage_id = :fanpageId", nativeQuery = true)
    public int getNumberFollowers(String fanpageId);
}
