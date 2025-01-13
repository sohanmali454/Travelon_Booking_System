import { createVehiclePicturesTable } from "../vehicle_pictures/model/vehicle_pictures_Model.js";
import { createVehicleTypesTable } from "../vehicle_types/model/vehicle_types_Model.js";
import { createVehiclesTable } from "../vehicles/model/vehicles_Model.js";

const initializeVehiclesDB = async () => {
  try {
    await createVehicleTypesTable();
    await createVehiclesTable();
    await createVehiclePicturesTable();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initializeVehiclesDB;
