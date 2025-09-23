document.addEventListener('DOMContentLoaded', () => {
  // Wait for Firebase to be fully initialized
  const checkFirebase = setInterval(() => {
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
      clearInterval(checkFirebase);
      initializeApp();
    }
  }, 100);
});

function initializeApp() {
  // Firebase auth instance
  const auth = firebase.auth();
  const SERVER_URL = 'http://localhost:5500';

  // Elements
  const loginTab = document.getElementById('login-tab');
  const signupTab = document.getElementById('signup-tab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');
  const panelTitle = document.getElementById('panel-title');
  const panelDescription = document.getElementById('panel-description');

  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const forgotPasswordModal = document.getElementById('forgot-password-modal');
  const closeModalBtn = document.querySelector('.close-btn');
  const forgotPasswordForm = document.getElementById('forgot-password-form');

  const googleLoginBtn = document.getElementById('google-login');
  const googleSignupBtn = document.getElementById('google-signup');
  const appleLoginBtn = document.getElementById('apple-login');
  const appleSignupBtn = document.getElementById('apple-signup');

  // Tab Switching
  function switchForm(form) {
    if (form === 'login') {
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
      document.getElementById('login-form').classList.add('active');
      document.getElementById('signup-form').classList.remove('active');
      panelTitle.textContent = 'Welcome to BuildNest!';
      panelDescription.innerHTML = 'Access your projects, collaborate with peers, and continue building a portfolio that opens doors.<br><br><b>Log in</b> to resume your journey and showcase your skills.';
    } else {
      loginTab.classList.remove('active');
      signupTab.classList.add('active');
      document.getElementById('login-form').classList.remove('active');
      document.getElementById('signup-form').classList.add('active');
      panelTitle.textContent = 'Join BuildNest today!';
      panelDescription.innerHTML = 'Turn Your Skills Into Real-World Impact. Start Building Today!<br><br><b>Create your account</b> to collaborate with peers and build a portfolio that opens doors.';
    }
    
    clearAllMessages();
  }

  function clearAllMessages() {
    document.querySelectorAll('.error-message, .success-message, .validation-message').forEach(el => {
      el.style.display = 'none';
      el.textContent = '';
    });
    
    document.querySelectorAll('.input-container').forEach(container => {
      container.classList.remove('valid', 'invalid');
    });
  }

  loginTab.addEventListener('click', () => switchForm('login'));
  signupTab.addEventListener('click', () => switchForm('signup'));
  switchToSignup.addEventListener('click', e => { e.preventDefault(); switchForm('signup'); });
  switchToLogin.addEventListener('click', e => { e.preventDefault(); switchForm('login'); });

  // Toggle Password Visibility
  document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
      const input = this.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });

  // Forgot Password Modal
  forgotPasswordLink.addEventListener('click', e => {
    e.preventDefault();
    forgotPasswordModal.style.display = 'flex';
    document.getElementById('forgot-password-message').style.display = 'none';
    document.getElementById('forgot-password-success').style.display = 'none';
  });
  
  closeModalBtn.addEventListener('click', () => forgotPasswordModal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === forgotPasswordModal) forgotPasswordModal.style.display = 'none'; });

  // Validation Helpers
  function showError(id, msg) { 
    const el = document.getElementById(id); 
    if (el) {
      el.textContent = msg; 
      el.style.display = 'block'; 
    }
  }
  
  function showSuccess(id, msg) { 
    const el = document.getElementById(id); 
    if (el) {
      el.textContent = msg; 
      el.style.display = 'block'; 
    }
  }
  
  function validateEmail(email) { 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
  }
  
  function validatePassword(password) {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { 
      isValid: password.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial, 
      length: password.length >= minLength, 
      upper: hasUpper, 
      lower: hasLower, 
      number: hasNumber, 
      special: hasSpecial 
    };
  }

  function updatePasswordStrength(password) {
    const meter = document.getElementById('password-strength');
    const text = document.getElementById('password-strength-text');
    if (!password) { 
      meter.style.width = '0%'; 
      text.textContent = ''; 
      return; 
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength <= 2) { 
      meter.className = 'password-strength-meter password-weak';
      text.textContent = 'Weak'; 
      text.style.color = '#dc3545'; 
    } else if (strength <= 4) { 
      meter.className = 'password-strength-meter password-medium';
      text.textContent = 'Medium'; 
      text.style.color = '#ffc107'; 
    } else { 
      meter.className = 'password-strength-meter password-strong';
      text.textContent = 'Strong'; 
      text.style.color = '#28a745'; 
    }
  }

  // Real-time Validation
  const signupPassword = document.getElementById('signupPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  document.getElementById('fullName').addEventListener('blur', e => {
    const isValid = e.target.value.trim().length >= 2;
    const container = e.target.parentElement;
    const messageEl = document.getElementById('full-name-message');
    
    if (isValid) {
      container.classList.add('valid');
      container.classList.remove('invalid');
      if (messageEl) messageEl.style.display = 'none';
    } else {
      container.classList.add('invalid');
      container.classList.remove('valid');
    }
  });

  document.getElementById('signupEmail').addEventListener('blur', e => {
    const isValid = validateEmail(e.target.value);
    const container = e.target.parentElement;
    const messageEl = document.getElementById('signup-email-message');
    
    if (isValid) {
      container.classList.add('valid');
      container.classList.remove('invalid');
      if (messageEl) messageEl.style.display = 'none';
    } else {
      container.classList.add('invalid');
      container.classList.remove('valid');
    }
  });

  signupPassword.addEventListener('input', e => {
    const validation = validatePassword(e.target.value);
    updatePasswordStrength(e.target.value);
    const container = e.target.parentElement;
    const messageEl = document.getElementById('signup-password-message');
    
    if (validation.isValid) {
      container.classList.add('valid');
      container.classList.remove('invalid');
      if (messageEl) messageEl.style.display = 'none';
    } else {
      container.classList.add('invalid');
      container.classList.remove('valid');
    }
  });

  confirmPassword.addEventListener('input', e => {
    const isValid = e.target.value === signupPassword.value;
    const container = e.target.parentElement;
    const messageEl = document.getElementById('confirm-password-message');
    
    if (isValid && e.target.value) {
      container.classList.add('valid');
      container.classList.remove('invalid');
      if (messageEl) messageEl.style.display = 'none';
    } else if (e.target.value) {
      container.classList.add('invalid');
      container.classList.remove('valid');
    }
  });

  // Firebase Email/Password Authentication
  // Signup with Email/Password
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    clearAllMessages();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = signupPassword.value;
    const confirm = confirmPassword.value;
    const terms = document.getElementById('terms').checked;

    let hasErrors = false;

    if (fullName.length < 2) {
      showError('full-name-message', 'Please enter your full name (min 2 characters)');
      document.getElementById('full-name-container').classList.add('invalid');
      hasErrors = true;
    }

    if (!validateEmail(email)) {
      showError('signup-email-message', 'Please enter a valid email address');
      document.getElementById('signup-email-container').classList.add('invalid');
      hasErrors = true;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showError('signup-password-message', 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      document.getElementById('signup-password-container').classList.add('invalid');
      hasErrors = true;
    }

    if (password !== confirm) {
      showError('confirm-password-message', 'Passwords do not match');
      document.getElementById('confirm-password-container').classList.add('invalid');
      hasErrors = true;
    }

    if (!terms) {
      showError('signup-message', 'You must agree to the terms and privacy policy');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await user.updateProfile({
        displayName: fullName
      });

      // Save user data to MySQL
      await saveUserToMySQL({
        uid: user.uid,
        fullName: fullName,
        email: email,
        createdAt: new Date().toISOString()
      });

      // Store user data for dashboard
      localStorage.setItem('buildnest_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || fullName,
        photoURL: user.photoURL
      }));

      showSuccess('signup-success', 'Account created successfully! Redirecting...');
      signupForm.reset();
      updatePasswordStrength('');
      
      setTimeout(() => {
        window.location.href = 'signup&login.html';
      }, 1500);

    } catch (error) {
      console.error('Signup error:', error);
      showError('signup-message', getFirebaseErrorMessage(error));
    }
  });

  // Login with Email/Password
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    clearAllMessages();
    
    if (!email || !password) { 
      showError('login-message', 'Please fill all fields'); 
      return; 
    }
    
    if (!validateEmail(email)) {
      showError('login-message', 'Please enter a valid email address');
      return;
    }

    try {
      
      // Set persistence based on remember me
      const persistence = rememberMe ? 
        firebase.auth.Auth.Persistence.LOCAL : 
        firebase.auth.Auth.Persistence.SESSION;
      
      await auth.setPersistence(persistence);
      
      // Sign in with email and password
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Store user data for dashboard
      localStorage.setItem('buildnest_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      showSuccess('login-success', 'Login successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = 'finaldash.html';
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      showError('login-message', getFirebaseErrorMessage(error));
    }
  });

  // Google Authentication
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  
  function setupGoogleAuth(button, isSignup = false) {
    button.addEventListener('click', async () => {
      try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        // Save user data to MySQL
        await saveUserToMySQL({
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          isGoogleUser: true,
          createdAt: new Date().toISOString()
        });

        // Store user data for dashboard
        localStorage.setItem('buildnest_user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isGoogleUser: true
        }));

        const messageId = isSignup ? 'signup-success' : 'login-success';
        showSuccess(messageId, 'Google authentication successful! Redirecting...');
        
        setTimeout(() => {
          window.location.href = 'finaldash.html';
        }, 1500);

      } catch (error) {
        console.error('Google auth error:', error);
        const messageId = isSignup ? 'signup-message' : 'login-message';
        showError(messageId, getFirebaseErrorMessage(error));
      }
    });
  }

  // Setup Google auth buttons
  if (googleLoginBtn) setupGoogleAuth(googleLoginBtn, false);
  if (googleSignupBtn) setupGoogleAuth(googleSignupBtn, true);

  // Forgot Password
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    
    document.getElementById('forgot-password-message').style.display = 'none';
    document.getElementById('forgot-password-success').style.display = 'none';
    
    if (!email || !validateEmail(email)) { 
      showError('forgot-password-message', 'Please enter a valid email address'); 
      return; 
    }
    
    try {
      await auth.sendPasswordResetEmail(email);
      showSuccess('forgot-password-success', 'Password reset email sent! Check your inbox.');
      
      setTimeout(() => { 
        forgotPasswordModal.style.display = 'none'; 
        switchForm('login'); 
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      showError('forgot-password-message', getFirebaseErrorMessage(error));
    }
  });

  // Apple Authentication (Placeholder)
  function handleAppleAuth(isSignup = false) {
    const messageId = isSignup ? 'signup-message' : 'login-message';
    showError(messageId, 'Apple authentication is not yet implemented. Please use email signup or Google authentication.');
  }

  if (appleLoginBtn) appleLoginBtn.addEventListener('click', () => handleAppleAuth(false));
  if (appleSignupBtn) appleSignupBtn.addEventListener('click', () => handleAppleAuth(true));

  // Helper function to get user-friendly error messages
  function getFirebaseErrorMessage(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please try logging in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled. Please try again.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Save user data to MySQL
  async function saveUserToMySQL(userData) {
    try {
      const response = await fetch(`${SERVER_URL}/api/save-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to save user data to database');
      }

      const data = await response.json();
      console.log('User data saved to MySQL:', data);
      
    } catch (error) {
      console.error('Error saving user to MySQL:', error);
      // Don't show error to user since Firebase auth already worked
    }
  }

  // Auth state listener
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in:', user);
    } else {
      console.log('User is signed out');
    }
  });

  // Test server connection
  async function testServerConnection() {
    try {
      const response = await fetch(`${SERVER_URL}/api/health`);
      if (response.ok) {
        console.log('✅ Server connection successful');
      }
    } catch (error) {
      console.log('⚠️ Server not responding - MySQL features may be limited');
    }
  }

  testServerConnection();
}