package com.example.NotifiService.model;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.NotifiService.processor.MailNotificationProcessor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MailNotification extends Notification {
    String mailType;
    String to;
    String from;
    String subject;
    String body;

    public MailNotification(List<String> parts) throws IOException {
        super(parts);
        this.mailType = parts.get(1);
        this.to = parts.get(2);
        this.subject = getSubject(mailType);
        this.body = getBody(this.mailType, parts.get(4), getDatas(mailType, parts.get(3)));
    }

    private String getSubject(String mailType) {
        switch (mailType) {
            case "ForgotPassword":
                return "CODE TO RESET YOUR PASSWORD";
            default:
                return null;
        }
    }

    private String getBody(String mailType, String templatePath, Map<String, String> datas) throws IOException {
        String template = getTemplateMail(mailType, templatePath);

        // add data to template
        for (Map.Entry<String, String> entry : datas.entrySet()) {
            template = template.replace("{" + entry.getKey() + "}", entry.getValue());
        }

        return template;
    }

    private String getTemplateMail(String type, String templatePath) throws IOException {
        // create absolute path
        String absolutePath = Paths.get(templatePath).toAbsolutePath().toString() + "\\ForgotPassword.txt";

        // read file
        switch (type) {
            case "ForgotPassword":
                Path filePath = Paths.get(absolutePath);
                return Files.readString(filePath);
            default:
                return null;
        }
    }

    private String generateCode() {
        StringBuilder code = new StringBuilder("");

        // generate 6 random numbers (0 - 9)
        for (int i = 0; i < 6; i++) {
            code.append((int) (Math.random() * 10));
        }

        return code.toString();
    }

    private Map<String, String> getDatasForgotPassword(String code) {
        Map<String, String> datas = new HashMap<>();
        datas.put("code", code);
        return datas;
    }

    private Map<String, String> getDatas(String type, String code) {
        switch (type) {
            case "ForgotPassword":
                return getDatasForgotPassword(code);
            default:
                return null;
        }
    }
}
