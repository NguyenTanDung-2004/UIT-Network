package com.example.ChatService.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.ChatService.dto.ExternalUserInfo;
import com.example.ChatService.dto.RequestAddMember;
import com.example.ChatService.dto.RequestCreateGroup;
import com.example.ChatService.dto.ResponseListGroup;
import com.example.ChatService.entity.Group;
import com.example.ChatService.entity.WorkSheet;
import com.example.ChatService.enums.EnumGroupType;
import com.example.ChatService.enums.EnumStatus;
import com.example.ChatService.mapper.GroupMapper;
import com.example.ChatService.model.GroupChatUIHome;
import com.example.ChatService.repository.GroupRepository;
import com.example.ChatService.repository.WorkSheetRepository;
import com.example.ChatService.repository.httpclient.UserClient;
import com.example.ChatService.response.ApiResponse;
import com.example.ChatService.response.EnumResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserClient userClient;

    @Autowired
    private GroupMapper groupMapper;

    @Autowired
    private UserGroupService userGroupService;

    @Autowired
    private WorkSheetRepository workSheetRepository;

    public ResponseEntity createGroup(RequestCreateGroup request, String authorizationHeader) {
        // get userid from header
        String userId = (String) userClient.getUserId(authorizationHeader);

        // create extra fields
        Map<String, Object> extraFields = new HashMap<>();
        extraFields.put("ownerid", userId);
        

        // convert request to entity
        Group group = (Group) groupMapper.toEntity(request, extraFields);

        // save group to database
        group = this.groupRepository.save(group);

        // create member in group
        request.getMemberids().add(userId);
        userGroupService.createUserGroup(request.getMemberids(), group.getId());
        // return response
        ApiResponse response = ApiResponse.builder()
                .object(group)
                .enumResponse(EnumResponse.toJson(EnumResponse.CREATE_GROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }

    public ResponseEntity addMembers(RequestAddMember request, String authorizationHeader) {
        this.userGroupService.createUserGroup(request.getMemberids(), request.getGroupid());

        // return response
        ApiResponse response = ApiResponse.builder()
                .object(request)
                .enumResponse(EnumResponse.toJson(EnumResponse.ADD_MEMBER_SUCCESS))
                .build();
        return ResponseEntity.ok(response);
    }

    @Transactional(rollbackOn = { Exception.class })
    public ResponseEntity removeMembers(RequestAddMember request, String authorizationHeader) {
        this.groupRepository.removeUserGroup(request.getMemberids(), request.getGroupid());

        // return response
        ApiResponse response = ApiResponse.builder()
                .object(request)
                .enumResponse(EnumResponse.toJson(EnumResponse.REMOVE_MEMBER_SUCCESS))
                .build();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity checkUserGroup(String userid1, String userid2) {
        String groupid = this.groupRepository.findGroup2User(userid1, userid2);

        Group group = null;

        if (groupid == null) {
            // create group
            group = new Group();
            group.setType(EnumGroupType.IsUser.getId());
            group.setStatus(EnumStatus.ACTIVE.getValue());
            group.setCreateddate(new Date());
            group.setModifieddate(new Date());
            // save group
            group = groupRepository.save(group);

            // create user_group
            this.userGroupService.createUserGroup(List.of(userid1, userid2), group.getId());
        }
        else{
            group = this.groupRepository.findById(groupid).get();
        }

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(group)
                .enumResponse(EnumResponse.toJson(EnumResponse.CHECK_USER_GROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }

    @Transactional(rollbackOn = { Exception.class })
    public ResponseEntity seenMessage(String groupid, String authorizationHeader) {
        // get user id from authorizationHeader
        String userId = (String) userClient.getUserId(authorizationHeader);

        System.out.println(userId);

        // update 
        this.groupRepository.updateSeenMessage(groupid, userId, new Date());

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(null)
                .enumResponse(EnumResponse.toJson(EnumResponse.SEEN_MESSAGE_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }

    /*
     * this api is used to get list group of user
     * - groupid
     * - avt
     * - groupname
     * - seen
     */
    public ResponseEntity getListGroup(String authorizationHeader) {
        // get user id from authorizationHeader
        String userId = (String) userClient.getUserId(authorizationHeader);

        // get list group of user
        List<Object[]> results = this.groupRepository.findListGroup(userId);

        List<ResponseListGroup> groups = new ArrayList<>();

        for (Object[] row : results) {
            ResponseListGroup group = new ResponseListGroup();
            group.setId((String) row[0]);
            group.setType(((Number) row[1]).intValue());          // fix
            group.setName((String) row[2]);
            group.setOwnerid((String) row[3]);
            group.setStatus((String) row[4]);
            group.setCreateddate((Date) row[5]);
            group.setModifieddate((Date) row[6]);
            group.setAvturl((String) row[7]);
            group.setOtheruserid((String) row[8]);
            group.setIsdisplay(((Number) row[9]).intValue());     // fix
            group.setIsseen(((Number) row[10]).intValue());       // fix
            groups.add(group);
        }
        

        if (groups == null || groups.size() == 0) {
            groups = new ArrayList<>();
        }
        else{
            // get avturl
            getAvtURL(groups);
        }

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(groups)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_LIST_GROUP_SUCCESS))
                .build();

        return ResponseEntity.ok(response);
    }

    private void getAvtURL(List<ResponseListGroup> groups) {
        List<String> userids = new ArrayList<>();

        groups.stream().forEach(group -> {
            if (group.getType() == EnumGroupType.IsUser.getId()) {
                userids.add(group.getOtheruserid());
            } else {
                userids.add(group.getId());
            }
        });

        if (userids != null && userids.size() > 0){
            // convert list to string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < userids.size(); i++) {
                sb.append(userids.get(i));
                if (i != userids.size() - 1) {
                    sb.append(",");
                }
            }
            String userIds = sb.toString();

            // get user info
            Object listUserInfos = this.userClient.getListUserInfos(userIds);
            List<ExternalUserInfo> externalUserInfos = new ObjectMapper().convertValue(listUserInfos, 
                new TypeReference<List<ExternalUserInfo>>() {});

            // map userid to avturl
            Map<String, ExternalUserInfo> avtUrls = new HashMap<>();
            externalUserInfos.stream().forEach(userInfo -> {
                avtUrls.put(userInfo.getUserId(), userInfo);
            });

            // set avturl to group
            groups.stream().forEach(group -> {
                if (group.getType() == EnumGroupType.IsUser.getId()) {
                    group.setAvturl(avtUrls.get(group.getOtheruserid()).getAvtURL());
                    group.setName(avtUrls.get(group.getOtheruserid()).getUserName() == null ? avtUrls.get(group.getOtheruserid()).getStudentId()
                            : avtUrls.get(group.getOtheruserid()).getUserName());
                }
            });
        }


    }

    public ResponseEntity getListGroupInHome(String userid) {
        List<Object[]> results = this.groupRepository.findListGroupInHome(userid);
        List<GroupChatUIHome> groups = new ArrayList<>();

        if (results != null && results.size() > 0) {
            groups = results.stream().map(r -> {
                return new GroupChatUIHome(
                    (String) r[0], // id
                    (Integer) r[1], // type
                    (String) r[2], // name
                    (String) r[3], // ownerid
                    (String) r[4], // status 
                    (Date) r[5],    // createddate
                    (Date) r[6], // modifieddate
                    (String) r[7], // avturl
                    (String) r[8] // userid
                );
            }).toList();

            // get userids in group that has type = 2
            List<String> userids = new ArrayList<>();
            groups.stream().forEach(group -> {
                if (group.getType() == EnumGroupType.IsUser.getId()) {
                    userids.add(group.getUserid());
                }
            });

            if (userids != null && userids.size() > 0) {
                // convert list to string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < userids.size(); i++) {
                    sb.append(userids.get(i));
                    if (i != userids.size() - 1) {
                        sb.append(",");
                    }
                }
                String userIds = sb.toString();
                System.out.println("userIds: " + userIds);

                // get user info
                Object listUserInfos = this.userClient.getListUserInfos(userIds);
                List<ExternalUserInfo> externalUserInfos = new ObjectMapper().convertValue(listUserInfos,
                        new TypeReference<List<ExternalUserInfo>>() {
                        });

                // map userid to avturl
                Map<String, ExternalUserInfo> avtUrls = new HashMap<>();
                externalUserInfos.stream().forEach(userInfo -> {
                    avtUrls.put(userInfo.getUserId(), userInfo);
                });

                // set avturl to group
                groups.stream().forEach(group -> {
                    if (group.getType() == EnumGroupType.IsUser.getId()) {
                        group.setAvturl(avtUrls.get(group.getUserid()).getAvtURL());
                        group.setName(avtUrls.get(group.getUserid()).getUserName() == null ? avtUrls.get(group.getUserid()).getStudentId()
                                : avtUrls.get(group.getUserid()).getUserName());
                    }
                });
            }
        }
        // create response
        ApiResponse response = ApiResponse.builder()
                .object(groups)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_LIST_GROUP_SUCCESS))
                .build();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity getListWSInGroup(String groupid) {
        // TODO Auto-generated method stub
        List<WorkSheet> works = this.workSheetRepository.findListWSInGroup(groupid);

        // create response
        ApiResponse response = ApiResponse.builder()
                .object(works)
                .enumResponse(EnumResponse.toJson(EnumResponse.GET_LIST_GROUP_SUCCESS))
                .build();
        return ResponseEntity.ok(response);
    }

}
