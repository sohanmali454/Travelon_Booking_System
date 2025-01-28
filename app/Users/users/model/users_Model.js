import { pool } from "../../../../config/database/db.js";

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(100) NOT NULL,
      gender CHAR(1),
      dob DATE,
      mobile_number VARCHAR(20) NOT NULL,
      alternate_contact_number VARCHAR(20),
      email VARCHAR(100),
      image_url VARCHAR(200),
      created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      verification_status SMALLINT NOT NULL CHECK (verification_status IN (Pending-0,Completed-1)),
      status SMALLINT NOT NULL CHECK (status IN (0, 1)),
      is_deleted BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Users table created successfully.");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

export { createUsersTable };
