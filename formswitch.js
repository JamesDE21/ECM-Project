document.addEventListener('DOMContentLoaded', function() {
    // Get references to the login and signup elements
    var signupContainer = document.getElementById('signup-container');
    var signupLink = document.getElementById('signup');
    var loginContainer = document.getElementById('login-container');
    var loginLink = document.getElementById('login');

    // Add event listener to the signup link
    signupLink.addEventListener('click', function(event) {
        event.preventDefault();
        signupContainer.style.display = 'block';
        loginContainer.style.display = 'none';
    });

    // Add event listener to the login link
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });
});