package com.example.NotifiService.factory;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.example.NotifiService.model.MailNotification;
import com.example.NotifiService.model.Notification;

@Component
public class NotificationFactory {
    @Autowired
    private Environment env;

    public Notification getNotification(List<String> parts) throws IOException {
        switch (parts.get(0)) {
            case "email":
                parts.add(env.getProperty("mail.templatepath"));
                return new MailNotification(parts);
            default:
                return null;
        }
    }
}
