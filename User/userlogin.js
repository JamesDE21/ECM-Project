// Validation for the user registration form
document.getElementById('registerForm').addEventListener('submit', function(event) {
    // Prevent form submission
    event.preventDefault();

    // Get form values
   
    var email = document.getElementById('userSignupEmail').value;
    var password = document.getElementById('userSignupPassword').value;
    var confirmPassword = document.getElementById('userConfirmPassword').value;


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

    // If everything is valid, submit the form
    alert('Form submitted successfully!');
    event.target.submit();
});