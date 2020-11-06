
import document from "document";
import { Barometer } from "barometer";
import { geolocation } from "geolocation";


// Fetch UI elements we will need to change
var altitudeLabel = document.getElementById("altitude");
var distanceLabel = document.getElementById("distanceLZ");

// Initialize the UI with some values
altitudeLabel.text = "--";
distanceLabel.text = "--";


var lzLong;
var lzLat;

var currentLong;
var currentLat;

geolocation.getPosition(locationSuccess, locationError);

function locationSuccess(position) {
    currentLat = position.coords.latitude;
    currentLong = position.coords.longitude;
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}
// Create a new instance of the Barometer
var bar = new Barometer();

// Update the lavel with each reading from the sensor
bar.onreading = () => {
  altitudeLabel.text = altitudeFromPressure(bar.pressure / 100) + " ft";
  distanceLabel.text = distance(currentLat,currentLong,lzLat,lzLong);
}

// Begin monitoring the sensor
bar.start();

// Converts pressure in millibars to altitude in feet
// https://en.wikipedia.org/wiki/Pressure_altitude
function altitudeFromPressure(pressure) {
  return (1 - (pressure/1013.25)**0.190284)*145366.45;
}


//calculate distance between 2 coordinates
//https://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344
		return dist;
	}
}
