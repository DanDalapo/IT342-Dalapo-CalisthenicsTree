package edu.cit.dalapo.dto;

public class AuthResponse {
    private Integer userId;
    private String email;
    private String token;
    private String role;

    public AuthResponse(Integer userId, String email, String token, String role) {
        this.userId = userId;
        this.email = email;
        this.token = token;
        this.role = role;
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

    public String getRole() {
        return role;
    }
}