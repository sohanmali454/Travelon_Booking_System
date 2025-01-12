import { createCitiesServicedTable } from "../cities_serviced/model/cities_serviced_Model.js";
import { createCityDropLocationsTable } from "../city_drop_locations/model/city_drop_locations_Model.js";
import { createCityPickupLocationsTable } from "../city_pickup_locations/model/city_pickup_locations_Model.js";

const initializeMastersDB = async () => {
  try {
    await createCitiesServicedTable();
    await createCityPickupLocationsTable();
    await createCityDropLocationsTable();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initializeMastersDB;
