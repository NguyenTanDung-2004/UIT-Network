package com.example.FanpageGroupService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.FanpageGroupService.entities.Group;

public interface GroupRepository extends JpaRepository<Group, String> {

}
