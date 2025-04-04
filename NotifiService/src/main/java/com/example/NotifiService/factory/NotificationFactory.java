package com.example.NotifiService.factory;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.example.NotifiService.Enum.EnumNotifiType;
import com.example.NotifiService.model.ActionNotification;
import com.example.NotifiService.model.MailNotification;
import com.example.NotifiService.model.Notification;

@Component
public class NotificationFactory {
    @Autowired
    private Environment env;

    public Notification getNotification(List<String> parts) throws IOException {
        // get notification type from the first part of the message
        String type = parts.get(0);
        // parse to int
        Integer typeid = Integer.parseInt(type);

        // get EnumNotify
        EnumNotifiType enumNotifiType = EnumNotifiType.fromTypeId(typeid);

        switch (enumNotifiType) {
            case RESET_PASSWORD:
                parts.add(env.getProperty("mail.templatepath"));
                return new MailNotification(parts);
            case LIKE_NORMAL_USER_POST:
            case COMMENT_NORMAL_USER_POST:
                return new ActionNotification(parts);
            default:
                return null;
        }
    }
}
