import { createAdminTable } from "../../Admins/admin/model/adminModel.js";

const initializeAdminDB = async () => {
  try {
    await createAdminTable();
  } catch (error) {
    console.error("Error initializing Admin database:", error);
  }
};

export default initializeAdminDB;
