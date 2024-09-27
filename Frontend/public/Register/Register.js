// document.getElementById('register-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const name = document.getElementById('register-name').value;
//     const email = document.getElementById('register-email').value;
//     const password = document.getElementById('register-password').value;
//     const confirmPassword = document.getElementById('register-confirm-password').value;

//     if (password !== confirmPassword) {
//         alert('Passwords do not match.');
//         return;
//     }

//     const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
//     const userExists = storedUsers.some(user => user.email === email);

//     if (userExists) {
//         alert('User already exists.');
//     } else {
//         storedUsers.push({ name, email, password });
//         localStorage.setItem('users', JSON.stringify(storedUsers));
//         alert('Registration successful!');
//         window.location.href = '/login'; // Redirect to login page
//     }
// });

