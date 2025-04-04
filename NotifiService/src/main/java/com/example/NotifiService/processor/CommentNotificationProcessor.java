package com.example.NotifiService.processor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.example.NotifiService.model.ActionNotification;
import com.example.NotifiService.model.Notification;
import com.example.NotifiService.repository.NotifiRepository;
import com.example.NotifiService.repository.httpclient.UserClient;

@Component
public class CommentNotificationProcessor implements NotificationProcessor {

    @Autowired
    private NotifiRepository notificationRepository;

    @Autowired
    private UserClient userClient;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Inject SimpMessagingTemplate

    @Override
    public void process(Notification notification) throws IOException {
        ActionNotification actionNotification = (ActionNotification) notification;
        // save to database
        actionNotification = notificationRepository.save(actionNotification);

        // get user info
        Object listUserInfos = this.userClient.getListUserInfos(actionNotification.getCreatedid());
        //List<User> userInfos = new ObjectMapper().convertValue(listUserInfos, new TypeReference<List<User>>() {});
       
        Map<String, Object> datas = new HashMap<>();
        datas.put("user", listUserInfos);
        datas.put("notification", actionNotification);

        this.messagingTemplate.convertAndSend("/topic/action-notification/" + actionNotification.getReceivedid(), datas);
    }
    
    
}
