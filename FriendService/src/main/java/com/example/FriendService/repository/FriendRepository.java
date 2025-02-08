package com.example.FriendService.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.FriendService.entity.User;

public interface FriendRepository extends Neo4jRepository<User, String> {

}
