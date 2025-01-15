import initializeAdminDB from "../app/Admins/initDb/adminInitDB.js";
import initializeDriversDB from "../app/Drivers/initDb/driversInitDB.js";
import initializeMastersDB from "../app/Master/initDb/MastersInitDB.js";
import initializeRoutesDB from "../app/Routes/initDb/RoutesInitDB.js";
import initializeUsersDB from "../app/Users/initDb/usersInitDB.js";
import initializeVehiclesDB from "../app/Vehicles/initDb/VehiclesInitDB.js";

const initializeDatabase = async () => {
  try {
    console.log("Initializing databases...");
    await initializeAdminDB();
    await initializeDriversDB();
    await initializeMastersDB();
    await initializeRoutesDB();
    await initializeVehiclesDB();
    await initializeUsersDB();
    console.log("All tables are created or verified.");
  } catch (error) {
    console.error("Error initializing database...:", error);
  }
};

initializeDatabase();
