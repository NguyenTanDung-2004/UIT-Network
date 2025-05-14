package com.example.NotifiService.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.example.NotifiService.factory.NotificationFactory;
import com.example.NotifiService.factory.NotificationProcessorFactory;
import com.example.NotifiService.model.ActionNotification;
import com.example.NotifiService.model.Notification;
import com.example.NotifiService.processor.NotificationProcessor;
import com.example.NotifiService.repository.BrevoEmail;
import com.example.NotifiService.repository.NotifiRepository;
import com.example.NotifiService.response.ApiResponse;
import com.example.NotifiService.response.EnumResponse;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotifiService {
    @Autowired
    NotificationProcessorFactory notificationProcessorFactory;

    @Autowired
    NotificationFactory notificationFactory;

    @Autowired
    NotifiRepository notifiRepository;

    @KafkaListener(topics = "user-notification", groupId = "notification-group")
    public void handleNotification(String message) throws IOException {
        // update message
        message = message.replaceAll("\"", "");

        System.out.println(message);

        // convert message to notification model
        String[] parts = message.split("\\|\\|");

        // convert array to mutable list
        List<String> listParts = new ArrayList<>(Arrays.asList(parts));

        // create processor
        NotificationProcessor processor = notificationProcessorFactory.getProcessor(parts[0]);

        // create notification model
        Notification notification = notificationFactory.getNotification(listParts);

        // process notification
        processor.process(notification);
    }

    public ResponseEntity getListNotifications(String userId){
        // get list notification
        List<ActionNotification> list = notifiRepository.getListNotification(userId);

        if (list == null) {
           list = new ArrayList<>();
        } 

        ApiResponse apiResponse = ApiResponse.builder()
                .object(list)
                .enumResponse(EnumResponse.toJson(EnumResponse.SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
