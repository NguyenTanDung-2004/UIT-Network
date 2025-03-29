package com.example.PostService.models;

import java.util.List;

import com.example.PostService.entities.Comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ParentComment {
    Comment parentComment;
    List<Comment> listComment;
}
