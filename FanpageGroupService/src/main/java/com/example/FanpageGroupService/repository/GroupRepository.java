package com.example.FanpageGroupService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.FanpageGroupService.entities.Group;

public interface GroupRepository extends JpaRepository<Group, String> {

    @Query(value = "SELECT * FROM study_groups where id in (:ids)", nativeQuery = true)
    List<Group> getListGroupInfos(String ids);

}
