package com.example.FanpageGroupService.mapper;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.FanpageGroupService.dto.request.RequestCreateFanpage;
import com.example.FanpageGroupService.dto.request.RequestUpdateFanpage;
import com.example.FanpageGroupService.entities.Fanpage;

@Component
public class FanpageMapper implements Mapper {

    @Override
    public Object toEntity(Object object1, Object object2) {
        if (object1 instanceof RequestCreateFanpage) {
            return toEntity((RequestCreateFanpage) object1, (String) object2);
        } else if (object1 instanceof RequestUpdateFanpage) {
            return toEntity((RequestUpdateFanpage) object1, (Fanpage) object2);
        } else {
            return null;
        }
    }

    public Fanpage toEntity(RequestCreateFanpage requestCreateFanpage, String userId) {
        Date date = new Date();
        return Fanpage.builder()
                .name(requestCreateFanpage.getName())
                .intro(requestCreateFanpage.getIntro())
                .phone(requestCreateFanpage.getPhone())
                .email(requestCreateFanpage.getEmail())
                .avtURL(requestCreateFanpage.getAvtURL())
                .backgroundURL(requestCreateFanpage.getBackgroundURL())
                .createdUserId(userId)
                .createdDate(date)
                .updatedDate(date)
                .build();
    }

    public Fanpage toEntity(RequestUpdateFanpage request, Fanpage fanpage) {
        Date date = new Date();

        fanpage.setName(request.getName());
        fanpage.setIntro(request.getIntro());
        fanpage.setPhone(request.getPhone());
        fanpage.setEmail(request.getEmail());
        fanpage.setAvtURL(request.getAvtURL());
        fanpage.setBackgroundURL(request.getBackgroundURL());
        fanpage.setUpdatedDate(date);

        return fanpage;
    }

}
