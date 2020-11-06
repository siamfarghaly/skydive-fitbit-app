
// Advice to create gps in here

import { geolocation } from "geolocation";

geolocation.getCurrentPosition(locationSuccess, locationError, {
  timeout: 60 * 1000
});

function locationSuccess(position) {
  console.log(
    "Latitude: " + position.coords.latitude,
    "Longitude: " + position.coords.longitude
  );
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}
