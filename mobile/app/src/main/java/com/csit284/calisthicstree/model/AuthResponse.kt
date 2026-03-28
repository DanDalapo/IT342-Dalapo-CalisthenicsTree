package com.csit284.calisthicstree.model

data class AuthResponse(
    val id: Int,
    val email: String,
    val token: String
)