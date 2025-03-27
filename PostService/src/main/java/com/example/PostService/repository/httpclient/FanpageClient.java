package com.example.PostService.repository.httpclient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "fanpage-service", url = "${app.services.fanpage}")
public interface FanpageClient {

    @GetMapping(value = "/list/{userId}", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<String> getListFanpage(@PathVariable("userId") String userId);

    @GetMapping(value = "/list-info", produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Object getListFanpageInfos(@RequestParam(name = "ids") String ids);

}