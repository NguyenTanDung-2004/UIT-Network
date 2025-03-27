package com.example.PostService.repository.httpclient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "group-service", url = "${app.services.group}")
public interface GroupClient {
    @GetMapping(value = "/{groupId}/is-member/{userId}", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    Object isMember(
            @PathVariable("groupId") String groupId,
            @PathVariable("userId") String userId);

    @GetMapping(value = "/list/{userId}", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<String> getListGroup(@PathVariable("userId") String userId);

    @GetMapping(value = "/list-info", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    Object getListGroupInfos(@RequestParam(name = "ids") String ids);
}
