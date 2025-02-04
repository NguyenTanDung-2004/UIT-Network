package com.example.NotifiService.processor;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.NotifiService.model.Notification;
import com.example.NotifiService.repository.BrevoEmail;

@Component
public class MailNotificationProcessor implements NotificationProcessor {
    @Autowired
    private BrevoEmail brevoEmail;

    @Override
    public void process(Notification notification) throws IOException {
        brevoEmail.sendEmail(notification);
    }

}
