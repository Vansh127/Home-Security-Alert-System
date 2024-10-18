const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Initialize app
const app = express();
const PORT = 3000;

// Middleware to serve static files, parse JSON, cookies, and sessions
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/home-security')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// User model
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    const token = req.session.token;
    if (token) {
        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.redirect('/login?alert=invalid_token'); // Invalid token
            } else {
                req.userId = decoded.id; // Attach the user ID to the request
                next(); // Proceed to the next middleware
            }
        });
    } else {
        res.redirect('/login?alert=please_login'); // Redirect to login if no token found with query parameter
    }
}


// Routes for static pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Homepage', 'homepage.html'));
});

app.get('/about', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'AboutUs', 'aboutUs.html'));
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ContactUs', 'contactUs.html'));
});

app.get('/feature', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Feature', 'feature.html'));
});

app.get('/pricing', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Pricing', 'pricing.html'));
});

app.get('/pricing-checkout', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Pricing', 'pricingCheckout.html'));
});

app.get("/notify", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Safety', 'safety.html'));
});

app.get("/earthquake", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Safety', 'earthquake.html'));
});

app.get("/weather", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Safety', 'weather.html'));
});

// Login and Register routes (no auth required)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register', 'register.html'));
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Save the token in the session
        req.session.token = token;

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
});

// app.get('/check-login-status', (req, res) => {
//     if (token) {
//         jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
//             if (err) {
//                 return res.json({ isLoggedIn: false });
//             } else {
//                 return res.json({ isLoggedIn: true });
//             }
//         });
//     } else {
//         res.json({ isLoggedIn: false });
//     }
// });


// Logout route
// app.get('/logout', (req, res) => {
//     req.session.destroy(() => {
//         res.redirect('/login'); // Redirect to login page after session is destroyed
//     });
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

