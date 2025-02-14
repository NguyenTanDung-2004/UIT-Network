package com.example.PostService.factory;

import com.example.PostService.enums.EnumMediaType;
import com.example.PostService.models.media.File;
import com.example.PostService.models.media.Image;
import com.example.PostService.models.media.Media;
import com.example.PostService.models.media.Video;

public class MediaFactory {
    public Media getMedia(int typeId) {
        EnumMediaType enumType = EnumMediaType.fromTypeId(typeId);

        switch (enumType) {
            case TYPE_FILE:
                return new File();
            case TYPE_IMAGE:
                return new Image();
            case TYPE_VIDEO:
                return new Video();
            default:
                return null;
        }
    }
}
