document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const passwordStrength = document.getElementById('password-strength');
    const formMessage = document.getElementById('form-message');
    const formSuccess = document.getElementById('form-success');
    const googleSignUpBtn = document.getElementById('googleSignUp');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, togglePasswordBtn);
    });

    toggleConfirmPasswordBtn.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn);
    });

    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(passwordInput.value);
    });

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset messages
        formMessage.textContent = '';
        formSuccess.textContent = '';
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form values
        const fullName = document.getElementById('full_name').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        
        // Create user with Firebase Auth
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up successfully
                const user = userCredential.user;
                
                // Update user profile with display name
                user.updateProfile({
                    displayName: fullName
                }).then(() => {
                    // Save user data to MySQL
                    saveUserToMySQL(user.uid, fullName, email);
                }).catch((error) => {
                    formMessage.textContent = 'Error updating profile: ' + error.message;
                });
            })
            .catch((error) => {
                formMessage.textContent = error.message;
            });
    });

    // Google Sign Up
    googleSignUpBtn.addEventListener('click', function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                // This gives you a Google Access Token
                const credential = result.credential;
                const token = credential.accessToken;
                
                // The signed-in user info
                const user = result.user;
                
                // Save user data to MySQL
                saveUserToMySQL(user.uid, user.displayName, user.email);
            }).catch((error) => {
                formMessage.textContent = error.message;
            });
    });

    // Function to save user data to MySQL
    function saveUserToMySQL(uid, fullName, email) {
        // Make API call to your backend to save user data
        fetch('/api/save-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: uid,
                fullName: fullName,
                email: email
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formSuccess.textContent = 'Account created successfully!';
                // Redirect to dashboard or home page after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                formMessage.textContent = 'Error saving user data: ' + data.message;
            }
        })
        .catch(error => {
            formMessage.textContent = 'Network error: ' + error.message;
        });
    }

    // Helper functions
    function togglePasswordVisibility(input, button) {
        if (input.type === 'password') {
            input.type = 'text';
            button.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = 'password';
            button.classList.replace('fa-eye', 'fa-eye-slash');
        }
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        let message = '';
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength++;
        
        switch(strength) {
            case 0:
            case 1:
                message = 'Weak';
                passwordStrength.style.color = 'red';
                break;
            case 2:
            case 3:
                message = 'Medium';
                passwordStrength.style.color = 'orange';
                break;
            case 4:
            case 5:
                message = 'Strong';
                passwordStrength.style.color = 'green';
                break;
        }
        
        passwordStrength.textContent = message;
    }

    function validateForm() {
        const fullName = document.getElementById('full_name').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.getElementById('terms').checked;
        
        if (!fullName) {
            formMessage.textContent = 'Please enter your full name';
            return false;
        }
        
        if (!email) {
            formMessage.textContent = 'Please enter your email';
            return false;
        }
        
        if (!validateEmail(email)) {
            formMessage.textContent = 'Please enter a valid email address';
            return false;
        }
        
        if (!password) {
            formMessage.textContent = 'Please enter a password';
            return false;
        }
        
        if (password.length < 6) {
            formMessage.textContent = 'Password must be at least 6 characters long';
            return false;
        }
        
        if (password !== confirmPassword) {
            formMessage.textContent = 'Passwords do not match';
            return false;
        }
        
        if (!terms) {
            formMessage.textContent = 'Please agree to the Terms & Privacy Policy';
            return false;
        }
        
        return true;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});