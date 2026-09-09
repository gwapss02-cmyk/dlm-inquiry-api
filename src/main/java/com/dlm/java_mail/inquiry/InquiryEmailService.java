package com.dlm.java_mail.inquiry;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class InquiryEmailService {

    private final JavaMailSender mailSender;

    // Where inquiry notifications get sent — set in application.properties
    @Value("${inquiry.notify-to}")
    private String notifyTo;

    // The mailbox the email is sent FROM (your SMTP account)
    @Value("${spring.mail.username}")
    private String fromAddress;

    public InquiryEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendInquiryNotification(InquiryRequest inquiry) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(notifyTo);
        message.setReplyTo(inquiry.getEmail()); // hit "reply" to answer the customer directly
        message.setSubject("New inquiry from " + inquiry.getName());
        message.setText(buildBody(inquiry));
        mailSender.send(message);
    }

    private String buildBody(InquiryRequest i) {
        return """
                New inquiry received from the website:

                Name:    %s
                Company: %s
                Email:   %s
                Phone:   %s
                Service: %s

                Message:
                %s
                """.formatted(
                i.getName(),
                nullSafe(i.getCompany()),
                i.getEmail(),
                nullSafe(i.getPhone()),
                i.getService(),
                nullSafe(i.getMessage())
        );
    }

    private String nullSafe(String s) {
        return (s == null || s.isBlank()) ? "-" : s;
    }
}
