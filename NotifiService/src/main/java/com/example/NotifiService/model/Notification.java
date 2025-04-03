package com.example.NotifiService.model;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public abstract class Notification {
    Integer typeid;

    public Notification(List<String> parts) {
        this.typeid = Integer.parseInt(parts.get(0));
    }
}
