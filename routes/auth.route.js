const express = require('express');
const router = express.Router();

// Path: /auth/login
router.post('/login', (req, res) => {
    res.send('Login logic here');
});

// Path: /auth/register
router.post('/register', (req, res) => {
    res.send('Register logic here');
});

module.exports = router;