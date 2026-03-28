package com.csit284.calisthicstree

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.csit284.calisthicstree.model.LoginRequest
import com.csit284.calisthicstree.model.AuthResponse
import com.csit284.calisthicstree.api.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    // 1. Declare the UI variables
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var tvMessage: TextView
    private lateinit var btnLogin: Button
    private lateinit var btnGoogleLogin: Button
    private lateinit var tvSignUpLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)

        // Protects UI from overlapping with system status bars
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 2. Bind the variables to the IDs in your XML
        etEmail = findViewById(R.id.etLoginEmail)
        etPassword = findViewById(R.id.etLoginPassword)
        tvMessage = findViewById(R.id.tvLoginMessage)
        btnLogin = findViewById(R.id.btnLogin)
        btnGoogleLogin = findViewById(R.id.btnGoogleLogin)
        tvSignUpLink = findViewById(R.id.tvSignUpLink)

        // 3. Set up the Click Listeners
        btnLogin.setOnClickListener {
            handleLogin()
        }

        tvSignUpLink.setOnClickListener {
            // This takes them back to the Registration screen!
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        btnGoogleLogin.setOnClickListener {
            Toast.makeText(this, "Google OAuth coming in Phase 2!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun handleLogin() {
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        // Hide any previous error messages
        tvMessage.visibility = View.GONE

        if (email.isEmpty() || password.isEmpty()) {
            showMessage("Please enter your email and password", false)
            return
        }

        // Lock button while loading
        btnLogin.isEnabled = false
        btnLogin.text = "LOGGING IN..."

        val request = LoginRequest(email, password)

        // Send data to Spring Boot
        RetrofitClient.instance.loginUser(request).enqueue(object : Callback<AuthResponse> {
            override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                btnLogin.isEnabled = true
                btnLogin.text = "LOGIN"

                if (response.isSuccessful && response.body() != null) {
                    // 🎉 SUCCESS: Grab the JWT token from Spring Boot!
                    val token = response.body()!!.token

                    // 💾 SECURE STORAGE: Save the token so the user stays logged in
                    val sharedPreferences = getSharedPreferences("CalisthenicsPrefs", Context.MODE_PRIVATE)
                    sharedPreferences.edit().putString("JWT_TOKEN", token).apply()

                    showMessage("Login successful!", true)

                    // Display a toast confirming the token is saved
                    Toast.makeText(this@LoginActivity, "Token Saved! Ready for Dashboard.", Toast.LENGTH_LONG).show()

                } else {
                    // Invalid credentials (401/403 from Spring Boot)
                    showMessage("Invalid email or password", false)
                }
            }

            override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                btnLogin.isEnabled = true
                btnLogin.text = "LOGIN"
                showMessage("Server error. Is the backend running?", false)
            }
        })
    }

    // Helper to easily show green or red text
    private fun showMessage(message: String, isSuccess: Boolean) {
        tvMessage.text = message
        tvMessage.setTextColor(if (isSuccess) Color.parseColor("#10B981") else Color.parseColor("#EF4444"))
        tvMessage.visibility = View.VISIBLE
    }
}