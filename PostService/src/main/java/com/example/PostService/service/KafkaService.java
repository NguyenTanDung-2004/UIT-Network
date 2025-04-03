package com.example.PostService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.PostService.entities.Post;
import com.example.PostService.enums.EnumPostType;

import org.springframework.kafka.core.KafkaTemplate;

@Component
public class KafkaService {
    @Autowired
    KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String topic, Post post, String createdId, String notiMessage) {
        // check if this is liking normal post
        if (post.getParentId() == null) {
            // create message
            String message = 1 + "||" + createdId + "||" + notiMessage + "||" + post.getUserId();

            // pust to kafka
            this.kafkaTemplate.send(topic, message);
        }
    }
}
