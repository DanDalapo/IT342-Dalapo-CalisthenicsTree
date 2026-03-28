package com.csit284.calisthicstree.api

import com.csit284.calisthicstree.model.AuthResponse
import com.csit284.calisthicstree.model.RegisterRequest
import com.csit284.calisthicstree.model.LoginRequest
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    // This perfectly matches your Spring Boot @PostMapping("/api/v1/auth/register")
    @POST("api/v1/auth/register")
    fun registerUser(@Body request: RegisterRequest): Call<AuthResponse>

    @POST("api/v1/auth/login")
    fun loginUser(@Body request: LoginRequest): Call<AuthResponse>
}