package com.example.NotifiService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.example.NotifiService.repository.httpclient")
public class NotifiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotifiServiceApplication.class, args);
	}

}
