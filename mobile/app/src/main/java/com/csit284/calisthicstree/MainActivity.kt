package com.csit284.calisthicstree

import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.csit284.calisthicstree.model.RegisterRequest
import com.csit284.calisthicstree.model.AuthResponse
import com.csit284.calisthicstree.api.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    // 1. Declare UI Variables
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

        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 2. Bind UI Elements to XML IDs
        etFirstName = findViewById(R.id.etFirstName)
        etLastName = findViewById(R.id.etLastName)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        etConfirmPassword = findViewById(R.id.etConfirmPassword)
        spinnerFitnessLevel = findViewById(R.id.spinnerFitnessLevel)
        tvMessage = findViewById(R.id.tvMessage)
        btnSignUp = findViewById(R.id.btnSignUp)
        tvLoginLink = findViewById(R.id.tvLoginLink)

        // 3. Set Click Listeners
        btnSignUp.setOnClickListener {
            handleRegister()
        }

        tvLoginLink.setOnClickListener {
            // We will link this to the Login Activity later!
            Toast.makeText(this, "Login clicked!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun handleRegister() {
        val firstName = etFirstName.text.toString().trim()
        val lastName = etLastName.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()
        val confirmPassword = etConfirmPassword.text.toString().trim()
        val fitnessLevel = spinnerFitnessLevel.selectedItem.toString()

        tvMessage.visibility = View.GONE

        if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            showMessage("Please fill in all fields", false)
            return
        }

        if (password != confirmPassword) {
            showMessage("Passwords do not match", false)
            return
        }

        btnSignUp.isEnabled = false
        btnSignUp.text = "LOADING..."

        val request = RegisterRequest(firstName, lastName, email, password, fitnessLevel)

        RetrofitClient.instance.registerUser(request).enqueue(object : Callback<AuthResponse> {
            override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                btnSignUp.isEnabled = true
                btnSignUp.text = "SIGN UP"

                if (response.isSuccessful) {
                    showMessage("Account created successfully!", true)
                } else {
                    val errorBody = response.errorBody()?.string()
                    val errorMessage = errorBody ?: "Registration failed. Try again."
                    showMessage(errorMessage, false)
                }
            }

            override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                btnSignUp.isEnabled = true
                btnSignUp.text = "SIGN UP"
                showMessage("Server error. Is the backend running?", false)
            }
        })
    }

    private fun showMessage(message: String, isSuccess: Boolean) {
        tvMessage.text = message
        tvMessage.setTextColor(if (isSuccess) Color.parseColor("#10B981") else Color.parseColor("#EF4444"))
        tvMessage.visibility = View.VISIBLE
    }
}