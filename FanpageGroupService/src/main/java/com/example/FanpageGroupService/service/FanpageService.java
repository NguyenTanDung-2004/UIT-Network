package com.example.FanpageGroupService.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.FanpageGroupService.dto.request.RequestCreateFanpage;
import com.example.FanpageGroupService.dto.request.RequestUpdateFanpage;
import com.example.FanpageGroupService.entities.Fanpage;
import com.example.FanpageGroupService.exception.EnumException;
import com.example.FanpageGroupService.exception.ExternalException;
import com.example.FanpageGroupService.exception.UserException;
import com.example.FanpageGroupService.mapper.FanpageMapper;
import com.example.FanpageGroupService.mapper.Mapper;
import com.example.FanpageGroupService.repository.FanpageRepository;
import com.example.FanpageGroupService.repository.httpclient.UserClient;
import com.example.FanpageGroupService.response.ApiResponse;
import com.example.FanpageGroupService.response.EnumResponse;

import feign.FeignException;

@Service
public class FanpageService {
    @Autowired
    private FanpageRepository fanpageRepository;

    @Autowired
    private UserClient userClient;

    private final Mapper mapper;

    @Autowired
    private FanpageService(FanpageMapper fanpageMapper) {
        this.mapper = fanpageMapper;
    }

    public ResponseEntity createFanpage(RequestCreateFanpage request, String authorizationHeader) {
        // get userid
        String userId = getUserId(authorizationHeader);

        // convert to fanpage
        Fanpage fanpage = (Fanpage) this.mapper.toEntity(request, userId);

        // save
        fanpage = this.fanpageRepository.save(fanpage);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(fanpage)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_FANPAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    private String getUserId(String authorizationHeader) {
        // get userId
        String userId;
        try {
            userId = (String) userClient.getUserId(authorizationHeader);
        } catch (Exception e) {
            if (e instanceof FeignException) {
                throw new ExternalException((FeignException) e);
            } else {
                throw new UserException(EnumException.INTERNAL_ERROR);
            }
        }

        return userId;
    }

    public ResponseEntity updateFanpage(RequestUpdateFanpage request) {
        // get fanpage id
        Fanpage fanpage = getFanpage(request.getFanpageId());

        // update
        fanpage = (Fanpage) this.mapper.toEntity(request, fanpage);

        // save
        fanpage = this.fanpageRepository.save(fanpage);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(fanpage)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_FANPAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    public Fanpage getFanpage(String fanpageId) {
        Optional<Fanpage> optional = this.fanpageRepository.findById(fanpageId);

        if (optional.isEmpty()) {
            throw new UserException(EnumException.FANPAGE_NOT_FOUND);
        }

        return optional.get();
    }

    public ResponseEntity delete(String fanpageId) {
        // get fanpage id
        Fanpage fanpage = getFanpage(fanpageId);

        // update
        fanpage.setIsDelete(true);
        fanpage.setDeletedDate(new Date());

        // save
        fanpage = this.fanpageRepository.save(fanpage);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.DELETE_FANPAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
