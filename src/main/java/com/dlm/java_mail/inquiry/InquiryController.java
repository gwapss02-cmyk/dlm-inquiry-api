package com.dlm.java_mail.inquiry;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "*") // tighten this to your real domain before going to production
public class InquiryController {

    private final InquiryEmailService emailService;

    public InquiryController(InquiryEmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> submitInquiry(@Valid @RequestBody InquiryRequest inquiry) {
        try {
            emailService.sendInquiryNotification(inquiry);
            return ResponseEntity.ok(Map.of("status", "sent"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Could not send email. Please try again later."));
        }
    }
}
