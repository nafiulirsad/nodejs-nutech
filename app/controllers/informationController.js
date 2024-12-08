const pool = require('../db');

exports.getBanners = async (req, res) => {
    const result = await pool.query('SELECT * FROM banners');
    
    res.status(200).json({
        status: 0,
        message: "Sukses",
        data: result.rows,
    });
};

exports.getServices = async (req, res) => {
    const result = await pool.query('SELECT * FROM services');

    const services = result.rows.map(service => ({
        ...service,
        service_tariff: parseInt(service.service_tariff, 10)
    }));

    res.status(200).json({
        status: 0,
        message: "Sukses",
        data: services,
    });
};