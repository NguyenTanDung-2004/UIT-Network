package com.example.FanpageGroupService.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import feign.Request;

@Service
public class FanpageService {
    private final FanpageRepository fanpageRepository;

    private final UserClient userClient;

    private final Mapper mapper;

    @Autowired
    public FanpageService(FanpageMapper fanpageMapper, FanpageRepository fanpageRepository, UserClient userClient) {
        this.mapper = fanpageMapper;
        this.userClient = userClient;
        this.fanpageRepository = fanpageRepository;
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
                .enumResponse(EnumResponse.toJson(EnumResponse.UPDATE_FANPAGE_SUCCESS))
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

    @Transactional
    public ResponseEntity reactFanpage(String authorizationHeader,
            String fanpageId) {
        // get userId
        String userId = getUserId(authorizationHeader);

        // insert
        this.fanpageRepository.userReactFanpage(userId, fanpageId);

        // create response
        ApiResponse apiResponse = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.REACT_FANPAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
