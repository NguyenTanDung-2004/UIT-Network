package com.example.UserService.user.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "friend-service", url = "${app.services.friend}")
public interface FriendClient {

    @GetMapping(value = "/mutual-friend/list/{userId}", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Object getListFanpage(@PathVariable("userId") String userId);
}