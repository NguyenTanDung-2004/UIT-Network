package com.example.ChatService.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.ChatService.dto.RequestCallGeminiAPI;

@FeignClient(name = "Gemini-API", url = "${app.external-api.gemini}")
public interface GeminiAPI {
    @PostMapping(value = "", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Object createAIMessage(@RequestBody RequestCallGeminiAPI request);
}
