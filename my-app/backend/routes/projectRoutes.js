const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

router.post('/post', verifyJWT, (req, res) => {
    console.log('what');
    res.json({ 
        message: 'This is a protected route',
        user: req.user,
        roles: req.roles
    });
});
module.exports = router;