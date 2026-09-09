package com.dlm.java_mail.inquiry;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class InquiryRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String company;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String phone;

    @NotBlank(message = "Service is required")
    private String service;

    private String message;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
