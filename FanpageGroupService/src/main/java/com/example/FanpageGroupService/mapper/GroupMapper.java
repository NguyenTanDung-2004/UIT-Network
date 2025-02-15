package com.example.FanpageGroupService.mapper;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.FanpageGroupService.dto.request.RequestCreateFanpage;
import com.example.FanpageGroupService.dto.request.RequestCreateGroup;
import com.example.FanpageGroupService.dto.request.RequestUpdateFanpage;
import com.example.FanpageGroupService.dto.request.RequestUpdateGroup;
import com.example.FanpageGroupService.entities.Fanpage;
import com.example.FanpageGroupService.entities.Group;

@Component
public class GroupMapper implements Mapper {

    @Override
    public Object toEntity(Object object1, Object object2) {
        if (object1 instanceof RequestCreateGroup) {
            return toEntity((RequestCreateGroup) object1, (String) object2);
        } else if (object1 instanceof RequestUpdateGroup) {
            return toEntity((RequestUpdateGroup) object1, (Group) object2);
        } else {
            return null;
        }
    }

    public Group toEntity(RequestCreateGroup requestCreateGroup, String userId) {
        Date date = new Date();
        return Group.builder()
                .name(requestCreateGroup.getName())
                .intro(requestCreateGroup.getIntro())
                .phone(requestCreateGroup.getPhone())
                .email(requestCreateGroup.getEmail())
                .avtURL(requestCreateGroup.getAvtURL())
                .backgroundURL(requestCreateGroup.getBackgroundURL())
                .createdUserId(userId)
                .createdDate(date)
                .updatedDate(date)
                .build();
    }

    public Group toEntity(RequestUpdateGroup request, Group group) {
        Date date = new Date();

        group.setName(request.getName());
        group.setIntro(request.getIntro());
        group.setPhone(request.getPhone());
        group.setEmail(request.getEmail());
        group.setAvtURL(request.getAvtURL());
        group.setBackgroundURL(request.getBackgroundURL());
        group.setUpdatedDate(date);

        return group;
    }
}
