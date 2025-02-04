package com.example.NotifiService.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.NotifiService.processor.MailNotificationProcessor;
import com.example.NotifiService.processor.NotificationProcessor;

@Component
public class NotificationProcessorFactory {
    @Autowired
    private MailNotificationProcessor mailNotificationProcessor;

    public NotificationProcessor getProcessor(String type) {
        switch (type) {
            case "email":
                return mailNotificationProcessor;
            default:
                return null;
        }
    }

}
