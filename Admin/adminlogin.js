// Import the dummy database
// In a real-world scenario, you would use a module bundler or import statement
// Here, we assume dummyDatabase.js is loaded before adminlogin.js


// Validation for the admin registration form
document.getElementById('registerForm').addEventListener('submit', function(event) {
    // Prevent form submission
    event.preventDefault();

    // Get form values
    var email = document.getElementById('adminSignupEmail').value;
    var password = document.getElementById('adminSignupPassword').value;
    var confirmPassword = document.getElementById('adminConfirmPassword').value;

    // Validate email format
    var emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo)\.com$/;
    if (!emailPattern.test(email)) {
        alert('Invalid email format');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // If everything is valid, create the account
    dummyDatabase.createAccount(email, password);
    alert('Account created successfully!');
    
    // Reset the form and switch to login view
    document.getElementById('registerForm').reset();
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// Validation for the admin login form
document.querySelector('form[action="#"]').addEventListener('submit', function(event) {
    // Prevent form submission
    event.preventDefault();

    // Get form values
    var email = document.getElementById('adminEmail').value;
    var password = document.getElementById('adminPassword').value;

    var account = dummyDatabase.findAccount(email, password);
    sessionStorage.setItem('loggedInEmail', email);//Remove this

    if (account) {
        alert('Login successful!');
        // Redirect to admin dashboard
        window.location.href = './Dashboard%20UI/dashboard.html';
    } else {
        alert('Invalid email or password.');
    }
});
