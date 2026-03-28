package com.csit284.calisthicstree.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    // 10.0.2.2 is how the Android Emulator talks to your computer's localhost!
    private const val BASE_URL = "http://10.0.2.2:8080/"

    val instance: AuthApiService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create()) // Tells Retrofit to use JSON
            .build()

        retrofit.create(AuthApiService::class.java)
    }
}