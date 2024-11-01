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

// Api route for login functionality
app.post('/login', async (req, res) => {
    // Get the email and password from the request body
    const { email, password} = req.body;
try {
    // Goes through rows of User table and get the email and password
    const [rows]: any = await pool.query(`
        SELECT * 
        FROM users 
        WHERE email = ?
        `, [email]
        );
        // This checks if at least 1 row has been returned 
    if (rows.length > 0){
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/* Api route for Dashboard:
1) Check user role (in user table)
2) Fetch data from database based on user role
    if -> 
    Patient - see's patient table and their record
    Doctor - see's doctor table, their patients' record, and their employee record
    Nurse - see's nurse table, their patients' record, and their employee record
    Front desk - see's front desk table, their employee record, billing table, billing item table, insurance provider table
*/
