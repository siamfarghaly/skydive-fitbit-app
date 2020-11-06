import document from "document";
import { geolocation } from "geolocation";


//*******************************
//for onclick 'START' button, saves coordinates of LZ to variable
var lzLong;
var lzLat;

geolocation.getCurrentPosition(locationSuccess, locationError, {
  timeout: 60 * 1000
});

function locationSuccess(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
    lzLat = position.coords.latitude;
    lzLong = position.coords.longitude;
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

//**********************************
