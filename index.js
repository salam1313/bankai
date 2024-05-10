const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, 'somethingsecret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
    });
}

app.get('/login', (req, res) => {
    const user = { id: 3 };
    const token = jwt.sign
        ({
            user
        },
            'somethingsecret',
            {
                expiresIn: '1h'
            }
        );
    res.json({ token });
}
);


app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});