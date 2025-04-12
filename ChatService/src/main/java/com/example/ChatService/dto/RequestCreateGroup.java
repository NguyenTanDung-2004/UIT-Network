package com.example.ChatService.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCreateGroup {
    private Integer type;
    private String name;
    private String avturl;
    private List<String> memberids; // the size of this list must be greater than 1
}
