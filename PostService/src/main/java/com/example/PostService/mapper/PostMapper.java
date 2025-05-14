package com.example.PostService.mapper;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.PostService.dto.request.RequestCreatePost;
import com.example.PostService.dto.request.RequestUpdatePost;
import com.example.PostService.entities.Post;
import com.example.PostService.enums.EnumPostType;

@Component
public class PostMapper implements Mapper {

    @Override
    public Object toEntity(Object object1, Object object2) {
        if (object1 instanceof RequestCreatePost) {
            return toEntity((RequestCreatePost) object1);
        } else if (object1 instanceof RequestUpdatePost) {
            return toEntity((RequestUpdatePost) object1, (Post) object2);
        } else {
            return null;
        }
    }

    public Post toEntity(RequestCreatePost requestCreatePost) {
        // create date
        Date date = new Date();

        String statusgroup = "ACTIVE";

        if (requestCreatePost.getPostTypeId() == 6 || requestCreatePost.getPostTypeId() == 7) {
            statusgroup = "PENDING";
        } 

        // convert
        return Post.builder()
                .caption(requestCreatePost.getCaption())
                .media(requestCreatePost.getMedia())
                .postType(EnumPostType.toMap(EnumPostType.fromTypeId(requestCreatePost.getPostTypeId())))
                .createdDate(date)
                .updatedDate(date)
                .statusgroup(statusgroup)
                .parentId(createParentId(requestCreatePost.getPostTypeId(), requestCreatePost.getParentId()))
                .build();
    }

    public String createParentId(int postTypeId, String parentId) {
        if (parentId == null) {
            return null;
        }
        if (postTypeId == 6 || postTypeId == 7) {
            return "group||" + parentId;
        } else if (postTypeId == 4 || postTypeId == 5) {
            return "fanpage||" + parentId;
        } else {
            return null;
        }
    }

    public Post toEntity(RequestUpdatePost requestUpdatePost, Post post) {
        // create date
        Date date = new Date();

        post.setCaption(requestUpdatePost.getCaption());
        post.setMedia(requestUpdatePost.getMedia());
        post.setPostType(EnumPostType.toMap(EnumPostType.fromTypeId(requestUpdatePost.getPostTypeId())));
        post.setUpdatedDate(date);

        return post;
    }

}
