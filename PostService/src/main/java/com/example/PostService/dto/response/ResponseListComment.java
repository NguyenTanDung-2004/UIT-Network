package com.example.PostService.dto.response;

import java.util.List;

import com.example.PostService.models.ParentComment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseListComment {
    private List<ParentComment> listParentComment;
}
