import { createDriverAppTokensTable } from "../driver_app_tokens/model/driver_app_tokens_Model.js";
import { createDriverDocumentsTable } from "../driver_documents/model/driver_documentsModel.js";
import { createDriverPasswordsTable } from "../driver_passwords/model/driver_passwords_Model.js";
import { createDriversTable } from "../drivers/model/driverModel.js";

const initializeDriversDB = async () => {
  try {
    await createDriversTable();
    await createDriverDocumentsTable();
    await createDriverPasswordsTable();
    await createDriverAppTokensTable();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initializeDriversDB;
