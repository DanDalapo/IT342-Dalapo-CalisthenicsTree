package edu.cit.dalapo.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String confirmPassword;
    private String fitnessLevel;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public String getFitnessLevel() {
        return fitnessLevel;
    }
}