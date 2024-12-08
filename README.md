# Transaction Management Application

## Project Description
This is a comprehensive Node.js application for transaction management with user authentication, information services, and transaction tracking. The application uses JWT for authentication and PostgreSQL for data storage.

## Features
- User Registration and Authentication
- Profile Management
- Balance Management
- Transaction History
- Service and Banner Information

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- jsonwebtoken
- bcrypt
- dotenv

## Project Structure
```
nodejs-nutech/
│
├── app/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   │
│   ├── controllers/
│   │   ├── membershipController.js
│   │   ├── informationController.js
│   │   └── transactionController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── membershipRoutes.js
│   │   ├── informationRoutes.js
│   │   └── transactionRoutes.js
│   │
│   ├── utils/
│   │   ├── fileUtils.js
│   │   └── jwtUtils.js
│   │
│   ├── app.js
│   └── db.js
│
├── sql/
│   └── database_design.sql
├── uploads/
│   └── *.jpg
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Database Setup
1. Create a PostgreSQL database
2. Use the following SQL script to create necessary tables:

```sql
-- Create users table
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) NULL,
);

-- Create banners table
CREATE TABLE banners (
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

-- Inserting sample data into banners table
INSERT INTO banners (banner_name, banner_image, description)
VALUES 
    ('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
    ('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
    ('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
    ('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
    ('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
    ('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- Create services table
CREATE TABLE services (
    service_code VARCHAR(50) PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tariff NUMERIC NOT NULL
);

-- Inserting sample data into services table
INSERT INTO services (service_code, service_name, service_icon, service_tariff)
VALUES
    ('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
    ('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
    ('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
    ('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
    ('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
    ('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
    ('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
    ('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
    ('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
    ('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
    ('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
    ('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

-- Create transactions table
CREATE TABLE transactions (
    invoice_number VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) REFERENCES users(email),
    transaction_type VARCHAR(20) NOT NULL,
    total_amount NUMERIC NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Configuration
Create a `.env` file with the following variables:
```
JWT_SECRET=fc85d380325abc27be7c991d39702e613687a5c5fccedfe3348c60bd2d8deb7bbe13b90f61bac7563641f2e5dc9952c180d605c82c8752d11c33261f5565347b78f9ae34b6d922c3264b90df51a705731f74efc922aa2300661651f59463071971b10d24a5c89812460ecd7ebc6d8014ee17f99930f077eff21a0af48f1a97f4
BASE_URL='http://localhost:3000'
PORT=3000
```

## Installation
1. Clone the repository
```bash
git clone https://github.com/nafiulirsad/nodejs-nutech.git
cd nodejs-nutech
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

4. Start the application
```bash
npm start
```

## API Endpoints

### Membership Module
- `POST /registration` - User Registration
- `POST /login` - User Login
- `GET /profile` - Get User Profile
- `PUT /profile/update` - Update Profile
- `PUT /profile/image` - Update Profile Image

### Information Module
- `GET /banner` - Get Banners
- `GET /services` - Get Services

### Transaction Module
- `GET /balance` - Get User Balance
- `POST /topup` - Top Up Balance
- `POST /transaction` - Perform Transaction
- `GET /transaction/history` - Get Transaction History

## Authentication
- JWT (JSON Web Token) is used for authentication
- Token expires after 12 hours
- Bearer Token required for protected routes

## Error Handling
- Consistent error response format
- Status codes for different scenarios
- Detailed error messages

## Security
- Password hashing with bcrypt
- JWT token validation
- Input validation
- Prepared statements for database queries

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
```
MIT License

Copyright (c) 2024 Moch. Nafi'ul Irsad Al A.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Notes for Implementation
1. Use prepared statements with PostgreSQL client for all database queries
2. Implement JWT middleware for token validation
3. Use bcrypt for password hashing
4. Validate inputs (email format, password length)
5. Generate secure, random invoice numbers
6. Implement proper error handling
7. Use environment variables for configuration

## Additional Recommendations
- Implement logging
- Add rate limiting
- Use HTTPS in production
- Implement refresh token mechanism
- Add comprehensive unit and integration tests
