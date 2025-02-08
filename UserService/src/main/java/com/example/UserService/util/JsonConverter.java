package com.example.UserService.util;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.UserService.exception.EnumException;
import com.example.UserService.exception.UserException;
import com.example.UserService.user.model.TimeSlot;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class JsonConverter {
    // Convert JSON string to Java object
    public Map<String, List<TimeSlot>> toObject(String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, new TypeReference<>() {
            });
        } catch (IOException e) {
            throw new UserException(EnumException.JSON_OBJECT_FAIL);
        }
    }

    // Convert Java object to JSON string
    public String toJsonString(Map<String, List<TimeSlot>> schedule) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(schedule);
        } catch (IOException e) {
            throw new UserException(EnumException.OBJECT_JSON_FAIL);
        }
    }
}
