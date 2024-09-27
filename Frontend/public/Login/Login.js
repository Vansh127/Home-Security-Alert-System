// document.getElementById('login-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;

//     const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
//     const user = storedUsers.find(user => user.email === email && user.password === password);

//     if (user) {
//         alert('Login successful!');
//         window.location.href = '/'; // Redirect to home page
//     } else {
//         alert('Invalid email or password.');
//     }
// });
