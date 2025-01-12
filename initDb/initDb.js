import initializeAdminDB from "../app/Admins/initDb/adminInitDB.js";
import initializeDriversDB from "../app/Drivers/initDb/driversInitDB.js";
import initializeMastersDB from "../app/Master/initDb/MastersInitDB.js";

const initializeDatabase = async () => {
  try {
    console.log("Initializing databases...");
    await initializeAdminDB();
    await initializeDriversDB();
    await initializeMastersDB();
    console.log("All tables are created or verified.");
  } catch (error) {
    console.error("Error initializing database...:", error);
  }
};

initializeDatabase();
