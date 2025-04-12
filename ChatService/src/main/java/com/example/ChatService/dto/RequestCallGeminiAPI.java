package com.example.ChatService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCallGeminiAPI {
    private List<Content> contents; // ✅ contents is a list of Content

    public RequestCallGeminiAPI(String question){
        contents = new ArrayList<>();
        Content content = new Content();
        List<Part> parts = new ArrayList<>();
        Part part = new Part();
        part.setText(question);
        parts.add(part);
        content.setParts(parts);
        contents.add(content);
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class Content {
    private List<Part> parts; // ✅ parts is a list of Part
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class Part {
    private String text; // ✅ text is a String
}
/*
* {
  "contents": [
    {
      "parts": [
        {
          "text": "Làm sao để tạo một con diều"
        }
      ]
    }
  ]
}

 */

