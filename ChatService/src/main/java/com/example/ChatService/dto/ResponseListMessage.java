package com.example.ChatService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseListMessage {
    private String id;
    private String parentid;
    private String senderid;
    private String message;
    private String tags;
    private Integer type; // 0: text, 1: image, 2: video, 3: audio, 4: file
}
