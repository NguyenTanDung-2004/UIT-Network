package com.example.NotifiService.test;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@RestController
public class TestController {
    @Async
    @KafkaListener(topics = "user-events", groupId = "notification-group", concurrency = "2")
    public void consume(String message) {
        System.out.println(Thread.currentThread().getName() + " - Received: " + message);

        // // Introduce a 10-second non-blocking delay
        // Mono.delay(Duration.ofSeconds(10))
        // .doOnTerminate(() -> System.out
        // .println(Thread.currentThread().getName() + " - Finished processing after 10
        // seconds"))
        // .subscribe(); // Asynchronously process the delay

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        // Continue with the rest of the logic
        System.out.println("Message processing continues...");
    }

}
