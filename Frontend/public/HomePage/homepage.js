// document.addEventListener("DOMContentLoaded", function() {
//     console.log("Script loaded");
//     function checkLoginStatus() {
//         fetch('/check-login-status')
//             .then(response => response.json())
//             .then(data => {
//                 const isLoggedIn = data.isLoggedIn;
//                     if (isLoggedIn) {
//                         loginButton.style.display = 'none';
//                         registerButton.style.display = 'none';
//                         logoutButton.style.display = 'block';
//                         console.log("User is logged in. Showing logout button.");
//                     }
//                     else{
//                         window.location.href = '/login';
//                     }
//             })
//             .catch(error => console.error('Error checking login status:', error));
//     }

//     checkLoginStatus();
// });
