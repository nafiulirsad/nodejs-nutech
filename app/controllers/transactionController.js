const pool = require('../db');
const crypto = require('crypto');

exports.getBalance = async (req, res) => {
    const getBalance = await pool.query(
        `SELECT 
            COALESCE(SUM(CASE WHEN transaction_type = 'TOPUP' THEN total_amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN transaction_type = 'PAYMENT' THEN total_amount ELSE 0 END), 0) AS balance
        FROM transactions
        WHERE email = $1`, 
        [req.email]
    );

    if (getBalance.rows.length === 0) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak valid atau kadaluwarsa",
            data: null,
        });
    }

    const userBalance = parseInt(getBalance.rows[0].balance, 10);

    res.status(200).json({
        status: 0,
        message: "Get Balance Berhasil",
        data: { balance: userBalance },
    });
};

exports.topUp = async (req, res) => {
    const { top_up_amount } = req.body;

    if (isNaN(top_up_amount) || top_up_amount < 0) {
        return res.status(400).json({
            status: 102,
            message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
            data: null
        });
    }

    const invoiceNumber = 'INV-' + crypto.randomBytes(8).toString('hex').toUpperCase();

    await pool.query(
        `INSERT INTO transactions (invoice_number, email, transaction_type, total_amount, description)
        VALUES ($1, $2, 'TOPUP', $3, 'Top Up balance')`,
        [invoiceNumber, req.email, top_up_amount]
    );

    const getBalance = await pool.query(
        `SELECT 
            COALESCE(SUM(CASE WHEN transaction_type = 'TOPUP' THEN total_amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN transaction_type = 'PAYMENT' THEN total_amount ELSE 0 END), 0) AS balance
        FROM transactions
        WHERE email = $1`,
        [req.email]
    );

    const userBalance = parseInt(getBalance.rows[0].balance, 10);

    res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: { balance: userBalance }
    });
};

exports.addTransaction = async (req, res) => {
    const { service_code } = req.body;

    const serviceResult = await pool.query(
        `SELECT * FROM services WHERE service_code = $1`,
        [service_code]
    );

    if (serviceResult.rows.length === 0) {
        return res.status(400).json({
            status: 102,
            message: "Service atau Layanan tidak ditemukan",
            data: null
        });
    }

    const getBalance = await pool.query(
        `SELECT 
            COALESCE(SUM(CASE WHEN transaction_type = 'TOPUP' THEN total_amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN transaction_type = 'PAYMENT' THEN total_amount ELSE 0 END), 0) AS balance
        FROM transactions
        WHERE email = $1`,
        [req.email]
    );

    const userBalance = parseInt(getBalance.rows[0].balance, 10);
    const totalAmount = parseInt(serviceResult.rows[0].service_tariff, 10);

    if (userBalance < totalAmount) {
        return res.status(400).json({
            status: 102,
            message: "Saldo tidak cukup",
            data: null
        });
    }

    const invoiceNumber = 'INV-' + crypto.randomBytes(8).toString('hex').toUpperCase();
    const serviceName = serviceResult.rows[0].service_name;

    const transactionResult = await pool.query(
        `INSERT INTO transactions (invoice_number, email, transaction_type, total_amount, description)
        VALUES ($1, $2, 'PAYMENT', $3, $4)
        RETURNING invoice_number, email, transaction_type, total_amount, description, created_on`,
        [invoiceNumber, req.email, totalAmount, serviceName]
    );

    res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: {
            invoice_number: transactionResult.rows[0].invoice_number,
            service_code,
            service_name: serviceName,
            transaction_type: transactionResult.rows[0].transaction_type,
            total_amount: totalAmount,
            created_on: transactionResult.rows[0].created_on
        }
    });
}

exports.getTransactionHistory = async (req, res) => {
    const { offset, limit } = req.query;
    const params = [req.email];

    let query = 'SELECT * FROM transactions WHERE email = $1 ORDER BY created_on DESC';

    if (!isNaN(offset)) {
        query += ' OFFSET $2';
        params.push(parseInt(offset, 10));
    }

    if (!isNaN(limit)) {
        query += ' LIMIT $3';
        params.push(parseInt(limit, 10));
    }

    const result = await pool.query(query, params);

    const records = result.rows.map(row => {
        return {
            invoice_number: row.invoice_number,
            transaction_type: row.transaction_type,
            description: row.description,
            total_amount: parseInt(row.total_amount, 10),
            created_on: row.created_on
        };
    });

    res.status(200).json({
        status: 0,
        message: "Get History Berhasil",
        data: {
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10),
            records: records
        }
    });
};