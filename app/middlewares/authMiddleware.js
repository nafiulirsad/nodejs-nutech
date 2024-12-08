const { verifyToken } = require('../utils/jwtUtils');

const verifyAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak valid atau kadaluwarsa",
            data: null,
        });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak valid atau kadaluwarsa",
            data: null,
        });
    }

    req.email = decoded.email;
    
    next();
};

module.exports = { verifyAuth };
