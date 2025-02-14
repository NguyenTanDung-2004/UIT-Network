package com.example.FanpageGroupService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(basePackages = "com.example.FanpageGroupService.repository.httpclient")
@SpringBootApplication
public class FanpageGroupServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FanpageGroupServiceApplication.class, args);
	}

}
