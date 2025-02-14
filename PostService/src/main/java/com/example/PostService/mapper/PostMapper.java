package com.example.PostService.mapper;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.PostService.dto.request.RequestCreatePost;
import com.example.PostService.dto.request.RequestUpdatePost;
import com.example.PostService.entities.Post;

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

        // convert
        return Post.builder()
                .caption(requestCreatePost.getCaption())
                .media(requestCreatePost.getMedia())
                .postTypeId(requestCreatePost.getPostTypeId())
                .createdDate(date)
                .updatedDate(date)
                .build();
    }

    public Post toEntity(RequestUpdatePost requestUpdatePost, Post post) {
        // create date
        Date date = new Date();

        post.setCaption(requestUpdatePost.getCaption());
        post.setMedia(requestUpdatePost.getMedia());
        post.setPostTypeId(requestUpdatePost.getPostTypeId());
        post.setUpdatedDate(date);

        return post;
    }

}
