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


app.post('/dashboard', async (req, res) => {
    try {
      const { email } = req.body;
      // Fetch user data
      const [userRows]: any = await pool.query(
        `
        SELECT * FROM user_account WHERE email = ?
      `,
        [email]
      );
      if (userRows.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const user = userRows[0];
      const user_id = user.user_id;
      const role = user.role;
  
      switch (role) {
        case 'patient': {
          // Get patient data
          const [patientRows]: any = await pool.query(
            `
            SELECT * FROM patient WHERE user_id = ?
          `,
            [user_id]
          );
  
          if (patientRows.length === 0) {
            res.status(404).json({ message: 'Patient not found' });
            return;
          }
          const patient = patientRows[0];
          const patient_id = patient.patient_id;
  
          // Get records for the patient
          const [recordRows]: any = await pool.query(
            `
            SELECT * FROM record WHERE patient_id = ?
          `,
            [patient_id]
          );
  
          res.json({ patient, records: recordRows });
          break;
        }
        case 'doctor': {
          // Get employee data
          const [employeeRows]: any = await pool.query(
            `
            SELECT * FROM employee WHERE user_id = ?
          `,
            [user_id]
          );
  
          if (employeeRows.length === 0) {
            res.status(404).json({ message: 'Employee not found' });
            return;
          }
          const employee = employeeRows[0];
          const emp_id = employee.emp_id;
  
          // Get doctor data
          const [doctorRows]: any = await pool.query(
            `
            SELECT * FROM doctor WHERE emp_id = ?
          `,
            [emp_id]
          );
  
          if (doctorRows.length === 0) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
          }
          const doctor = doctorRows[0];
          const doctor_id = doctor.doctor_id;
  
          // Get patients of the doctor
          const [patientRows]: any = await pool.query(
            `
            SELECT * FROM patient WHERE doctor_id = ?
          `,
            [doctor_id]
          );
  
          // Get records where doctor_id = doctor_id
          const [recordRows]: any = await pool.query(
            `
            SELECT * FROM record WHERE doctor_id = ?
          `,
            [doctor_id]
          );
  
          res.json({ doctor, employee, patients: patientRows, records: recordRows });
          break;
        }
        case 'nurse': {
          // Get employee data
          const [employeeRows]: any = await pool.query(
            `
            SELECT * FROM employee WHERE user_id = ?
          `,
            [user_id]
          );
  
          if (employeeRows.length === 0) {
            res.status(404).json({ message: 'Employee not found' });
            return;
          }
          const employee = employeeRows[0];
          const emp_id = employee.emp_id;
  
          // Get nurse data
          const [nurseRows]: any = await pool.query(
            `
            SELECT * FROM nurse WHERE emp_id = ?
          `,
            [emp_id]
          );
  
          if (nurseRows.length === 0) {
            res.status(404).json({ message: 'Nurse not found' });
            return;
          }
          const nurse = nurseRows[0];
          const nurse_id = nurse.nurse_id;
  
          // Get patients of the nurse
          const [patientRows]: any = await pool.query(
            `
            SELECT * FROM patient WHERE nurse_id = ?
          `,
            [nurse_id]
          );
  
          // Get records where nurse_id = nurse_id
          const [recordRows]: any = await pool.query(
            `
            SELECT * FROM record WHERE nurse_id = ?
          `,
            [nurse_id]
          );
  
          res.json({ nurse, employee, patients: patientRows, records: recordRows });
          break;
        }
        case 'front_desk': {
          // Get employee data
          const [employeeRows]: any = await pool.query(
            `
            SELECT * FROM employee WHERE user_id = ?
          `,
            [user_id]
          );
  
          if (employeeRows.length === 0) {
            res.status(404).json({ message: 'Employee not found' });
            return;
          }
          const employee = employeeRows[0];
          const emp_id = employee.emp_id;
  
          // Get front desk data
          const [frontDeskRows]: any = await pool.query(
            `
            SELECT * FROM front_desk WHERE emp_id = ?
          `,
            [emp_id]
          );
  
          if (frontDeskRows.length === 0) {
            res.status(404).json({ message: 'Front desk employee not found' });
            return;
          }
          const frontDesk = frontDeskRows[0];
          const frontdesk_id = frontDesk.frontdesk_id;
  
          // Get billing data associated with frontdesk_id
          const [billingRows]: any = await pool.query(
            `
            SELECT * FROM billing WHERE frontdesk_id = ?
          `,
            [frontdesk_id]
          );
  
          // Get billing items associated with those billing records
          let billingItemRows: any = [];
          if (billingRows.length > 0) {
            const billingIds = billingRows.map((b: any) => b.billing_id);
            [billingItemRows] = await pool.query(
              `
              SELECT * FROM billing_items WHERE billing_id IN (?)
            `,
              [billingIds]
            );
          }
  
          // Get insurance providers associated with those billing records
          let insuranceProviderIds = billingRows
            .map((b: any) => b.insurance_provider_id)
            .filter((id: any) => id != null);
  
          let insuranceProviderRows: any = [];
          if (insuranceProviderIds.length > 0) {
            [insuranceProviderRows] = await pool.query(
              `
              SELECT * FROM insurance_provider WHERE provider_id IN (?)
            `,
              [insuranceProviderIds]
            );
          }
  
          res.json({
            frontDesk,
            employee,
            billing: billingRows,
            billingItems: billingItemRows,
            insuranceProviders: insuranceProviderRows,
          });
          break;
        }
        case 'admin': {
          res.json({ message: 'Admin dashboard not implemented yet' });
          break;
        }
        default: {
          res.status(400).json({ message: 'Invalid role' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });