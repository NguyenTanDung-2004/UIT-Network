package com.example.NotifiService.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.NotifiService.Enum.EnumNotifiType;
import com.example.NotifiService.processor.LikeNotificationProcessor;
import com.example.NotifiService.processor.MailNotificationProcessor;
import com.example.NotifiService.processor.NotificationProcessor;

@Component
public class NotificationProcessorFactory {
    @Autowired
    private MailNotificationProcessor mailNotificationProcessor;

    @Autowired
    private LikeNotificationProcessor likeNotificationProcessor;

    public NotificationProcessor getProcessor(String type) {
        Integer typeid = Integer.parseInt(type);
        // get EnumNotify
        EnumNotifiType enumNotifiType = EnumNotifiType.fromTypeId(typeid);

        switch (enumNotifiType) {
            case RESET_PASSWORD:
                return mailNotificationProcessor;
            case LIKE_NORMAL_USER_POST:
                return likeNotificationProcessor;
            default:
                return null;
        }
    }

}
