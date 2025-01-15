import { createUsersTable } from "../users/model/users_Model.js";

const initializeUsersDB = async () => {
  try {
    await createUsersTable();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initializeUsersDB;
