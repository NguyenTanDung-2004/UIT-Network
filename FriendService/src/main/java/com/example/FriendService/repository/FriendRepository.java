package com.example.FriendService.repository;

import com.example.FriendService.entity.User;
import com.example.FriendService.model.FriendSuggestion;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Optional;

public interface FriendRepository extends Neo4jRepository<User, String> {

        // Send Friend Request (Create REQUEST relationship)
        @Query("MATCH (a:User {id: $userId1}) " +
        "MATCH (b:User {id: $userId2}) " +
        "MERGE (a)-[:REQUEST]->(b)")
        void sendFriendRequest(String userId1, String userId2);


        // Accept Friend Request (Convert REQUEST to FRIEND)
        /*
         * The reason for deleting r is Neo4j is immutable. So we can change (update)
         * from one relationship to others.
         */
        @Query("MATCH (a:User {id: $userId1})-[r:REQUEST]->(b:User {id: $userId2}) " +
                        "DELETE r " +
                        "MERGE (a)-[:FRIEND]->(b) " +
                        "MERGE (b)-[:FRIEND]->(a)")
        void acceptFriendRequest(String userId1, String userId2);

        // Cancel Friend Request (Remove REQUEST relationship)
        @Query("MATCH (a:User {id: $userId1})-[r:REQUEST]->(b:User {id: $userId2}) DELETE r")
        void cancelFriendRequest(String userId1, String userId2);

        @Query("MATCH (a:User {id: $userId1})-[r:FRIEND]->(b:User {id: $userId2}) DELETE r " +
                        "WITH a, b " +
                        "MATCH (b)-[r2:FRIEND]->(a) DELETE r2")
        void removeFriend(String userId1, String userId2);

        Optional<User> findById(String id);

        @Query("MATCH (a:User {id: $userId1})-[r:FRIEND]->(b:User {id: $userId2}) RETURN COUNT(r)")
        int isFriend(String userId1, String userId2);

        @Query("MATCH (a:User {id: $userId})-[:FRIEND]->(b:User) RETURN b.id")
        List<String> getListFriend(String userId);


        @Query("""
        MATCH (u:User {id: $userId})-[:FRIEND]->(f1:User)-[:FRIEND]->(f2:User)
        WHERE NOT (u)-[:FRIEND]->(f2) AND u.id <> f2.id
        RETURN f2.id AS id, COUNT(*) AS numberOfMutuals
        ORDER BY numberOfMutuals DESC
        LIMIT 10
        """)
        List<FriendSuggestion> recommendFriends(String userId);


        @Query("MATCH (a:User)-[:REQUEST]->(b:User {id: $userId}) RETURN a.id")
        List<String> getListRequestFriend(String userId);


}
