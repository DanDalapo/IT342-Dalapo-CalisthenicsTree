package com.csit284.calisthicstree

import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.csit284.calisthicstree.model.RegisterRequest
import com.csit284.calisthicstree.model.AuthResponse
import com.csit284.calisthicstree.api.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegistrationActivity : AppCompatActivity() {

    private lateinit var etFirstName: EditText
    private lateinit var etLastName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var etConfirmPassword: EditText
    private lateinit var spinnerFitnessLevel: Spinner
    private lateinit var tvMessage: TextView
    private lateinit var btnSignUp: Button
    private lateinit var tvLoginLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registration)

        etFirstName = findViewById(R.id.etFirstName)
        etLastName = findViewById(R.id.etLastName)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        etConfirmPassword = findViewById(R.id.etConfirmPassword)
        spinnerFitnessLevel = findViewById(R.id.spinnerFitnessLevel)
        tvMessage = findViewById(R.id.tvMessage)
        btnSignUp = findViewById(R.id.btnSignUp)
        tvLoginLink = findViewById(R.id.tvLoginLink)

        btnSignUp.setOnClickListener {
            handleRegister()
        }

        tvLoginLink.setOnClickListener {
            finish()
        }
    }

    private fun handleRegister() {
        val firstName = etFirstName.text.toString().trim()
        val lastName = etLastName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()
        val confirmPassword = etConfirmPassword.text.toString().trim()
        val fitnessLevel = spinnerFitnessLevel.selectedItem.toString()

        // Hide any previous messages
        tvMessage.visibility = View.GONE

        // Basic Validation (Matches React!)
        if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            showMessage("Please fill in all fields", false)
            return
        }

        if (password != confirmPassword) {
            showMessage("Passwords do not match", false)
            return
        }

        // Lock the button to prevent spam clicking
        btnSignUp.isEnabled = false
        btnSignUp.text = "LOADING..."

        // Pack the data into your Kotlin DTO
        val request = RegisterRequest(firstName, lastName, email, password, fitnessLevel)

        // Send to Spring Boot via Retrofit
        RetrofitClient.instance.registerUser(request).enqueue(object : Callback<AuthResponse> {

            override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                btnSignUp.isEnabled = true
                btnSignUp.text = "SIGN UP"

                if (response.isSuccessful) {
                    // Success!
                    showMessage("Account created successfully! Redirecting...", true)

                    // Wait 2 seconds, then go back to Login screen
                    btnSignUp.postDelayed({
                        finish()
                    }, 2000)

                } else {
                    // This unmasks the "Account already exists" Spring Boot error
                    val errorBody = response.errorBody()?.string()
                    val errorMessage = errorBody ?: "Registration failed. Try again."
                    showMessage(errorMessage, false)
                }
            }

            override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                // Network failure (Emulator can't reach port 8080)
                btnSignUp.isEnabled = true
                btnSignUp.text = "SIGN UP"
                showMessage("Server error. Is the backend running?", false)
            }
        })
    }

    // Helper function to display Green/Red messages easily
    private fun showMessage(message: String, isSuccess: Boolean) {
        tvMessage.text = message
        // Hex colors matching React Tailwind CSS (#10B981 for green, #EF4444 for red)
        tvMessage.setTextColor(if (isSuccess) Color.parseColor("#10B981") else Color.parseColor("#EF4444"))
        tvMessage.visibility = View.VISIBLE
    }
}