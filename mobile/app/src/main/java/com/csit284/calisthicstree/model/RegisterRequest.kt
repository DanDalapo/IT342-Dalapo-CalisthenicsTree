package com.csit284.calisthicstree.model

data class RegisterRequest(
    val firstname: String,
    val lastname: String,
    val email: String,
    val password: String,
    val fitnessLevel: String
)