package com.example.PostService.mapper;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.PostService.dto.request.RequestCreateComment;
import com.example.PostService.dto.request.RequestUpdateComment;
import com.example.PostService.entities.Comment;

@Component
public class CommentMapper implements Mapper {
    @Override
    public Object toEntity(Object object1, Object object2) {
        if (object1 instanceof RequestCreateComment) {
            return toEntity((RequestCreateComment) object1);
        } else if (object1 instanceof Comment) {
            return toEntity((Comment) object1, (RequestUpdateComment) object2);
        } else {
            return null;
        }
    }

    public Comment toEntity(RequestCreateComment requestCreateComment) {
        Comment comment = Comment.builder()
                .content(requestCreateComment.getContent())
                .parentCommentId(requestCreateComment.getParentCommentId())
                .postId(requestCreateComment.getPostId())
                .userId(requestCreateComment.getUserId())
                .tagIds(requestCreateComment.getTagIds())
                .creatDate(new Date())
                .modifiedDate(new Date())
                .isDeleted(false)
                .build();

        comment.setMediaList(requestCreateComment.getListMedia());

        return comment;
    }

    public Comment toEntity(Comment comment, RequestUpdateComment requestUpdateComment) {
        comment.setContent(requestUpdateComment.getContent());
        comment.setTagIds(requestUpdateComment.getTagIds());
        comment.setMediaList(requestUpdateComment.getListMedia());
        comment.setModifiedDate(new Date());

        return comment;
    }

}
