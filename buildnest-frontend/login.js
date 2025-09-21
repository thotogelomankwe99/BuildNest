document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('login-password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginMessage = document.getElementById('login-message');
    const loginSuccess = document.getElementById('login-success');
    const googleLoginBtn = document.getElementById('googleLogin');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordBtn.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            togglePasswordBtn.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset messages
        loginMessage.textContent = '';
        loginSuccess.textContent = '';
        
        // Get form values
        const email = document.getElementById('login-email').value;
        const password = passwordInput.value;
        
        // Validate form
        if (!email) {
            loginMessage.textContent = 'Please enter your email';
            return;
        }
        
        if (!password) {
            loginMessage.textContent = 'Please enter your password';
            return;
        }
        
        // Sign in with Firebase Auth
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in successfully
                const user = userCredential.user;
                
                // Fetch user data from MySQL
                fetchUserData(user.uid);
            })
            .catch((error) => {
                loginMessage.textContent = error.message;
            });
    });

    // Google Login
    googleLoginBtn.addEventListener('click', function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                // This gives you a Google Access Token
                const credential = result.credential;
                const token = credential.accessToken;
                
                // The signed-in user info
                const user = result.user;
                
                // Check if user exists in MySQL, if not create record
                checkAndCreateUser(user.uid, user.displayName, user.email);
            }).catch((error) => {
                loginMessage.textContent = error.message;
            });
    });

    // Function to fetch user data from MySQL
    function fetchUserData(uid) {
        // Make API call to your backend to get user data
        fetch(`/api/get-user/${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginSuccess.textContent = 'Login successful!';
                // Store user data in localStorage or sessionStorage
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                loginMessage.textContent = 'Error fetching user data: ' + data.message;
            }
        })
        .catch(error => {
            loginMessage.textContent = 'Network error: ' + error.message;
        });
    }

    // Function to check if user exists and create if not
    function checkAndCreateUser(uid, displayName, email) {
        // First try to fetch user data
        fetch(`/api/get-user/${uid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // User exists, proceed with login
                loginSuccess.textContent = 'Login successful!';
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                // User doesn't exist, create new record
                saveUserToMySQL(uid, displayName, email);
            }
        })
        .catch(error => {
            loginMessage.textContent = 'Network error: ' + error.message;
        });
    }

    // Function to save user data to MySQL (for Google sign-in)
    function saveUserToMySQL(uid, fullName, email) {
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
                loginSuccess.textContent = 'Account created successfully!';
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                loginMessage.textContent = 'Error saving user data: ' + data.message;
            }
        })
        .catch(error => {
            loginMessage.textContent = 'Network error: ' + error.message;
        });
    }
});