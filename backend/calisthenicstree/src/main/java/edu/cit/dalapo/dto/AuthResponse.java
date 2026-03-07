package edu.cit.dalapo.dto;

public class AuthResponse {
    private Integer userId;
    private String email;
    private String token;

    public AuthResponse(Integer userId, String email, String token) {
        this.userId = userId;
        this.email = email;
        this.token = token;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }
}