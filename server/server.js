import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "../config/database/db.js";
import adminRoutes from "../app/Admins/admin/routes/adminRoutes.js";
import driverRoutes from "../app/Drivers/drivers/routes/driverRoutes.js";
import driver_documents_Routes from "../app/Drivers/driver_documents/routes/driver_documentsRoutes.js";
import driver_passwords_Routes from "../app/Drivers/driver_passwords/routes/driver_passwords_Routes.js";
import driver_app_tokens_Routes from "../app/Drivers/driver_app_tokens/routes/driver_app_tokens_Routes.js";
import cities_serviced_Routes from "../app/Master/cities_serviced/routes/cities_serviced_Routes.js";
import city_pickup_locations_Routes from "../app/Master/city_pickup_locations/routes/city_pickup_locations_Routes.js";
import city_drop_locations_Routes from "../app/Master/city_drop_locations/routes/city_drop_locations_Routes.js";
import "../initDb/initDb.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ADMINS
app.use("/api/admins", adminRoutes);

//DRIVERS
app.use("/api/drivers", driverRoutes);
app.use("/api/drivers/driver_documents", driver_documents_Routes);
app.use("/api/drivers/driver_passwords", driver_passwords_Routes);
app.use("/api/drivers/driver_app_tokens", driver_app_tokens_Routes);

//CITIES
app.use("/api/cities", cities_serviced_Routes);
app.use("/api/cities/city_pickup_locations", city_pickup_locations_Routes);
app.use("/api/cities/city_drop_locations", city_drop_locations_Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", async () => {
  try {
    await pool.connect();
    console.log(`Server is running on http://192.168.93.190:${PORT}`);
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
});
