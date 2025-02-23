package com.example.PostService.service.strategy.PostAccessStrategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PostAccessStrategyFactory {
    @Autowired
    private StudyGroupStrategy studyGroupStrategy;

    @Autowired
    private StudentPostStrategy studentPostStrategy;

    @Autowired
    private FanpagePostStrategy fanpagePostStrategy;

    public PostAccessStrategy getStrategy(String strategy) {
        if (strategy.equals("study_group_post")) {
            return studyGroupStrategy;
        } else if (strategy.equals("normal_student_post")) {
            return studentPostStrategy;
        } else if (strategy.equals("fanpage_post")) {
            return fanpagePostStrategy;
        } else {
            return null;
        }
    }
}
