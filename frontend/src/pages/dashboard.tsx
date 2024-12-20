import React, { useEffect, useState } from "react";
import { getDashboardData } from "../api/api";
import style from "./dashboard.module.css";

interface Patient {
  patient_id: number;
  name: string;
  age: number;
  // Add other patient fields as necessary
}

interface Doctor {
  doctor_id: number;
  name: string;
  age: number;
  specialty: string;
  // Add other doctor fields as necessary
}

interface Nurse {
  nurse_id: number;
  name: string;
  age: number;
  // Add other nurse fields as necessary
}

interface Employee {
  emp_id: number;
  user_id: number;
  salary: number;
  // Add other employee fields as necessary
}

interface Record {
  record_id: number;
  doctor_id: number;
  nurse_id: number;
  patient_id: number;
  diagnosis: string;
  room_number: number;
  // Add other record fields as necessary
}

interface FrontDesk {
  frontdesk_id: number;
  name: string;
  age: number;
  // Add other front desk fields as necessary
}

interface Billing {
  billing_id: number;
  patient_id: number;
  insurance_provider_id: number;
  frontdesk_id: number;
  total_amount: number;
  amount_covered_by_insurance: number;
  amount_due: number;
  billing_date: string;
  // Add other billing fields as necessary
}

interface BillingItem {
  bill_item_id: number;
  billing_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  // Add other billing item fields as necessary
}

interface InsuranceProvider {
  provider_id: number;
  name: string;
  // Add other insurance provider fields as necessary
}

const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    // Redirect to login page
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          console.warn("No email found. Please log in again.");
          window.location.href = "/login";
          return;
        }
        const data = await getDashboardData(email);
        // Determine the role based on the data returned
        if (data.patient) {
          setRole("patient");
        } else if (data.doctor) {
          setRole("doctor");
        } else if (data.nurse) {
          setRole("nurse");
        } else if (data.frontDesk) {
          setRole("front_desk");
        } else if (data.message === "Admin dashboard not implemented yet") {
          setRole("admin");
        } else {
          setRole("unknown");
        }
        setUserData(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (role === "unknown") {
    return <div>Unable to determine user role.</div>;
  }

  // Render the dashboard based on the user role
  return (
    <div className={style.container}>
      <h1 className={style.heading}>Dashboard</h1>
      {role === "patient" && (
        <PatientDashboard
          patientData={userData.patient}
          records={userData.records}
        />
      )}
      {role === "doctor" && (
        <DoctorDashboard
          doctorData={userData.doctor}
          employeeData={userData.employee}
          patients={userData.patients}
          records={userData.records}
        />
      )}
      {role === "nurse" && (
        <NurseDashboard
          nurseData={userData.nurse}
          employeeData={userData.employee}
          patients={userData.patients}
          records={userData.records}
        />
      )}
      {role === "front_desk" && (
        <FrontDeskDashboard
          frontDeskData={userData.frontDesk}
          employeeData={userData.employee}
          billing={userData.billing}
          billingItems={userData.billingItems}
          insuranceProviders={userData.insuranceProviders}
        />
      )}
      {role === "admin" && (
        <div>
          <h2>Admin Dashboard</h2>
          <p>Admin functionalities are not implemented yet.</p>
        </div>
      )}
      <div className={style.buttoncontainer}>
        <button className={style.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

// Components for each role's dashboard
const PatientDashboard: React.FC<{
  patientData: Patient;
  records: Record[];
}> = ({ patientData, records }) => {
  return (
    <div>
      <div className={style.sectionContainer}>
        <h2 className={style.subheading}>Welcome, {patientData.name}</h2>
        <p>Age: {patientData.age}</p>
        {/* add insurance provider */}
      </div>
      <div className={style.sectionContainer}>
        <h3 className={style.subheading}>Your Medical Records:</h3>
        {records.length > 0 ? (
          <ul className={style.recordlist}>
            {records.map((record) => (
              <li key={record.record_id} className={style.listitem}>
                <p>Diagnosis: {record.diagnosis}</p>
                <p>Room Number: {record.room_number}</p>
                {/* add insurance provider, Doctor Name, Nurse Name */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medical records found.</p>
        )}
      </div>
    </div>
  );
};

const DoctorDashboard: React.FC<{
  doctorData: Doctor;
  employeeData: Employee;
  patients: Patient[];
  records: Record[];
}> = ({ doctorData, employeeData, patients, records }) => {
  return (
    <div>
      <div className={style.sectionContainer}>
        <h2 className={style.subheading}> Welcome, {doctorData.name}</h2>
        <p>Specialty: {doctorData.specialty}</p>
        <p>Age: {doctorData.age}</p>
        <p>Salary: ${employeeData.salary}</p>
        {/* Display other doctor and employee details as needed */}
      </div>
      <div className={style.sectionContainer}>
        <h3 className={style.subheading}>Your Patients:</h3>
        {patients.length > 0 ? (
          <ul className={style.patientlist}>
            {patients.map((patient) => (
              <li key={patient.patient_id} className={style.listitem}>
                {patient.name} (Age: {patient.age})
              </li>
            ))}
          </ul>
        ) : (
          <p>No patients assigned.</p>
        )}
      </div>
      <div className={style.sectionContainer}>
        <h3 className={style.subheading}>Your Medical Records:</h3>
        {records.length > 0 ? (
          <ul className={style.recordlist}>
            {records.map((record) => (
              <li key={record.record_id} className={style.listitem}>
                <p>Patient ID: {record.patient_id}</p>
                <p>Diagnosis: {record.diagnosis}</p>
                {/* Display other record details as needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medical records found.</p>
        )}
      </div>
    </div>
  );
};

const NurseDashboard: React.FC<{
  nurseData: Nurse;
  employeeData: Employee;
  patients: Patient[];
  records: Record[];
}> = ({ nurseData, employeeData, patients, records }) => {
  return (
    <div>
      <div className={style.sectionContainer}>
        <h2 className={style.subheading}>Welcome, {nurseData.name}</h2>
        <p>Age: {nurseData.age}</p>
        <p>Salary: ${employeeData.salary}</p>
        {/* Display other nurse and employee details as needed */}
      </div>
      <div className={style.sectionContainer}>
        <h3 className={style.subheading}>Your Patients:</h3>
        {patients.length > 0 ? (
          <ul className={style.patientlist}>
            {patients.map((patient) => (
              <li key={patient.patient_id} className={style.listitem}>
                {patient.name} (Age: {patient.age})
              </li>
            ))}
          </ul>
        ) : (
          <p>No patients assigned.</p>
        )}
      </div>
      <div className={style.sectionContainer}>
        <h3 className={style.subheading}>Your Medical Records:</h3>
        {records.length > 0 ? (
          <ul className={style.recordlist}>
            {records.map((record) => (
              <li key={record.record_id} className={style.listitem}>
                <p>Patient ID: {record.patient_id}</p>
                <p>Diagnosis: {record.diagnosis}</p>
                {/* Display other record details as needed */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medical records found.</p>
        )}
      </div>
    </div>
  );
};

const FrontDeskDashboard: React.FC<{
  frontDeskData: FrontDesk;
  employeeData: Employee;
  billing: Billing[];
  billingItems: BillingItem[];
  insuranceProviders: InsuranceProvider[];
}> = ({
  frontDeskData,
  employeeData,
  billing,
  billingItems,
  insuranceProviders,
}) => {
  return (
    <div>
      <div className={style.sectionContainer}>
        <h2 className={style.subheading}>Welcome, {frontDeskData.name}</h2>
        <p>Age: {frontDeskData.age}</p>
        <p>Salary: ${employeeData.salary}</p>
        {/* Display other front desk and employee details as needed */}
      </div>
      <div className={style.sectionContainer}>
        <h3 className={style.subheading}>Billing Records:</h3>
        {billing.length > 0 ? (
          <ul className={style.billinglist}>
            {billing.map((bill) => (
              <li key={bill.billing_id} className={style.listitem}>
                <p>Billing ID: {bill.billing_id}</p>
                <p>Patient ID: {bill.patient_id}</p>
                <p>Total Amount: ${bill.total_amount}</p>
                <p>
                  Amount Covered by Insurance: $
                  {bill.amount_covered_by_insurance}
                </p>
                <p>Amount Due: ${bill.amount_due}</p>
                <p>
                  Billing Date:{" "}
                  {new Date(bill.billing_date).toLocaleDateString()}
                </p>
                {/* Find and display related billing items */}
                <h4>Billing Items:</h4>
                <ul className={style.recordlist}>
                  {billingItems
                    .filter((item) => item.billing_id === bill.billing_id)
                    .map((item) => (
                      <li key={item.bill_item_id} className={style.listitem}>
                        <p>Description: {item.description}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Unit Price: ${item.unit_price}</p>
                        <p>Total Price: ${item.total_price}</p>
                      </li>
                    ))}
                </ul>
                {/* Display insurance provider information */}
                {insuranceProviders
                  .filter(
                    (provider) =>
                      provider.provider_id === bill.insurance_provider_id
                  )
                  .map((provider) => (
                    <p key={provider.provider_id}>
                      Insurance Provider: {provider.name}
                    </p>
                  ))}
              </li>
            ))}
          </ul>
        ) : (
          <p>No billing records found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
