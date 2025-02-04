package com.example.NotifiService.processor;

import java.io.IOException;

import com.example.NotifiService.model.Notification;

public interface NotificationProcessor {
    void process(Notification notification) throws IOException;
}
