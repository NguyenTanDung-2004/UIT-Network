package com.example.PostService.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "friend-service", url = "${app.services.friend}")
public interface FriendClient {
    @GetMapping(value = "/is-friend/{userId1}/{userId2}", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Object isFriend(@PathVariable(name = "userId1") String userId1,
            @PathVariable(name = "userId2") String userId2);
}
