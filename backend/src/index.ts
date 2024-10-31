import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import mysql2 from 'mysql2/promise';
import cors from 'cors';

//Initialize dotenv
dotenv.config();

// Create express app
const app = express();

// Retrieve the port number from the enviorment variable
const port = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json()); 

// Connect to the MySQL database
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Api route
app.post('/login', async (req, res) => {
    // Get the email and password from the request body
    const { email, password} = req.body;
    // Goes through rows of User table and get the email and password
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length != 0){
        // Check if the password matches the stored password
        if (rows[0].password === password){
           
            res.json({ message: 'Login Successful'});
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    else {
        res.status(404).json({ message: 'Invalid email or password' });
    }
});