package com.example.UserService.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendSuggestion {
    private String id;
    private Integer numberOfMutuals;
}
