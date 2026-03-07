package edu.cit.dalapo.dto;

public class RegisterRequest {
    // 1. Matched perfectly to what React is sending
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String fitnessLevel;

    // --- GETTERS ---
    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFitnessLevel() { return fitnessLevel; }

    // --- SETTERS (CRITICAL FOR SPRING BOOT) ---
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFitnessLevel(String fitnessLevel) { this.fitnessLevel = fitnessLevel; }
}