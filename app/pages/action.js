import document from "document";
import { geolocation } from "geolocation";
import { Barometer } from "barometer";


var altitudeLabel = document.getElementById("altitude");
var distanceLabel = document.getElementById("distanceLZ");

var currentLong;
var currentLat;

//watch current GPS coordinates + calculate distance LZ
var watchID = geolocation.watchPosition(watchLocation, watchLocationError, { timeout: 60 * 1000 });

function watchLocation(position) {
    currentLat = position.coords.latitude;
    currentLong = position.coords.longitude;
    console.log("Current Latitude: " + position.coords.latitude,
                "Current Longitude: " + position.coords.longitude);
    distanceLabel.text = distance(currentLat,currentLong,lzLat,lzLong);
}

function watchLocationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

// Create Barometer, 1 reading per second
var bar = new Barometer({ frequency: 1 });

// Update the values with each reading
bar.onreading = () => {
  altitudeLabel.text = altitudeFromPressure(bar.pressure / 100) + " ft";
}

// Begin monitoring the sensor
bar.start();


// Converts pressure in millibars to altitude in feet
// https://en.wikipedia.org/wiki/Pressure_altitude
function altitudeFromPressure(pressure) {
  return (1 - (pressure/1013.25)**0.190284)*145366.45;
}


//calculates distance between 2 coordinates
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
