package com.example.FanpageGroupService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.FanpageGroupService.entities.Fanpage;

public interface FanpageRepository extends JpaRepository<Fanpage, String> {

}
