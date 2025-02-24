package com.example.PostService.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "${app.services.user}")
public interface UserClient {
    @GetMapping(value = "/external-get-user-info", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Object getUserInfo(@RequestHeader("Authorization") String authorizationHeader);

    @GetMapping(value = "/user-id", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Object getUserId(@RequestHeader("Authorization") String authorizationHeader);

    @GetMapping(value = "/user-info", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Object getListUserInfos(@RequestHeader("userId") String userIds);
}
