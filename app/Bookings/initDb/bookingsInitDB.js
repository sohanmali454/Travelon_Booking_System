import { createBookingsTable } from "../bookings/model/bookings_Model.js";


const initializeBookingsDB = async () => {
  try {
    await createBookingsTable();
   
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initializeBookingsDB;
