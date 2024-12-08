const pool = require('../db');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { generateToken } = require('../utils/jwtUtils');
const { isValidFile } = require('../utils/fileUtils');

dotenv.config();

exports.registration = async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            status: 102,
            message: "Parameter email tidak sesuai format",
            data: null
        });
    }
    
    if (!password || password.length < 8) {
        return res.status(400).json({
            status: 102,
            message: "Password harus lebih dari 8 karakter",
            data: null
        });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
        'INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, first_name, last_name, hashedPassword]
    );

    res.status(200).json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            status: 102,
            message: "Parameter email tidak sesuai format",
            data: null
        });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
        return res.status(401).json({
            status: 103,
            message: "Username atau password salah",
            data: null
        });
    }
    
    const user = result.rows[0];
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            status: 103,
            message: "Username atau password salah",
            data: null
        });
    }
    
    const token = generateToken(user.email);
    
    res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data: { token }
    });
};

exports.profile = async (req, res) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [req.email]);

    if (result.rows.length === 0) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak tidak valid atau kadaluwarsa",
            data: null
        });
    }
    
    const user = result.rows[0];

    res.status(200).json({
        status: 0,
        message: "Sukses",
        data: {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image || null
        }
    });
};

exports.updateProfile = async (req, res) => {
    const { first_name, last_name } = req.body;

    const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING *',
        [first_name, last_name, req.email]
    );
    
    const user = result.rows[0];

    res.status(200).json({
        status: 0,
        message: "Update Pofile berhasil",
        data: {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image || null
        }
    });
};

exports.updateProfileImage = async (req, res) => {
    const file = req.file;

    if (!isValidFile(file)) {
        return res.status(400).json({
            status: 102,
            message: "Format Image tidak sesuai",
            data: null
        });
    }
    
    const updatedFileImage = `${process.env.BASE_URL}/uploads/${file.filename}`;

    const result = await pool.query(
        'UPDATE users SET profile_image = $1 WHERE email = $2 RETURNING *',
        [updatedFileImage, req.email]
    );
    
    const user = result.rows[0];
    
    res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_image: user.profile_image
        }
    });
};