package com.example.FanpageGroupService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FanpageGroupService.dto.request.RequestCreateFanpage;
import com.example.FanpageGroupService.dto.request.RequestUpdateFanpage;
import com.example.FanpageGroupService.service.FanpageService;

@RestController
@RequestMapping("/fanpage")
public class FanpageController {
    @Autowired
    private FanpageService fanpageService;

    @PostMapping("/create")
    public ResponseEntity createFanpage(@RequestBody RequestCreateFanpage request,
            @RequestHeader("Authorization") String authorizationHeader) {
        return fanpageService.createFanpage(request, authorizationHeader);
    }

    @PostMapping("/update")
    public ResponseEntity updateFanpage(@RequestBody RequestUpdateFanpage request) {
        return fanpageService.updateFanpage(request);
    }

    @DeleteMapping("/delete")
    public ResponseEntity deleteFanpage(@RequestParam(name = "fanpageId") String fanpageId) {
        return fanpageService.delete(fanpageId);
    }

    @PostMapping("/{fanpageId}/reactions")
    public ResponseEntity reactFanpage(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable(name = "fanpageId") String fanpageId) {
        return fanpageService.reactFanpage(authorizationHeader, fanpageId);
    }

    @GetMapping("/notexternal/list/{userId}")
    public ResponseEntity getListFanpageNotExternal(@PathVariable(name = "userId") String userId) {
        return fanpageService.getListFanpageNotExternal(userId);
    }

    @GetMapping("/search")
    public ResponseEntity searchFanpage(@RequestParam(name = "text") String text) {
        return fanpageService.searchFanpage(text);
    }

    @GetMapping("/{fanpageId}")
    public ResponseEntity getFanpageInfo(@PathVariable(name = "fanpageId") String fanpageId) {
        return fanpageService.getFanpageInfo(fanpageId);
    }

    @GetMapping("/number-followers/{fanpageId}")
    public ResponseEntity getNumberFollowers(@PathVariable(name = "fanpageId") String fanpageId) {
        return fanpageService.getNumberFollowers(fanpageId);
    }

    /**
     * External APIs
     */
    @GetMapping("/list/{userId}")
    public ResponseEntity getListFanpage(@PathVariable(name = "userId") String userId) {
        return fanpageService.getListFanpage(userId);
    }

    @GetMapping("/list-info")
    public ResponseEntity getListFanpageInfos(@RequestParam(name = "ids") String ids) {
        return fanpageService.getListFanpageInfos(ids);
    }
}
