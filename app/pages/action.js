import document from "document";
import { switchPage } from '../navigation';
import { geolocation } from "geolocation";
import { Barometer } from "barometer";
import exercise from "exercise";



var altitudeLabel;
var distanceLabel;
var distanceElem;
var verSpeedElem;
var verSpeedLabel;
var verticalSpeed;
var lzLong;
var lzLat;
var altitudeLZ;
var currentLong;
var currentLat;
var altitude;
var safeColor
var watchID;


// Create Barometer, 1 reading per second
var bar = new Barometer({ frequency: 1 });

// Update view with each reading of barometer
bar.onreading = () => {
  verticalSpeed = speedFromAltitude(altitude,altitudeFromPressure(bar.pressure/100));
  altitude = altitudeFromPressure(bar.pressure/100);
  pickLayout(verticalSpeed,altitude);
  altitudeLabel.text = altitude + " ft";
  verSpeedLabel.text = verticalSpeed + " km/h";
}


export function destroy() {
  console.log('destroy action page');
  altitudeLabel = null;
  distanceLabel = null;
  verSpeedLabel = null;
  verticalSpeed = null;
  lzLong = null;
  lzLat = null;
  currentLong = null;
  currentLat = null;
  altitude = null;
  safeColor = null;
  altitudeLZ = null;
}

export function init() {
  console.log('init action page');
  altitudeLabel = document.getElementById('altitude');
  distanceLabel = document.getElementById('distanceLZ');
  distanceElem = document.getElementById('distanceValue');
  verSpeedElem = document.getElementById('speedValue');
  verSpeedLabel = document.getElementById('verSpeed');
  safeColor = document.getElementById('safeColor');

  watchDistanceLZ();
  bar.start();
  exercise.start("golf", { gps: true, disableTouch: true });
};


function watchDistanceLZ(){

  //get current location, create Landing Zone coordinates
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


  //watch current GPS coordinates + calculate distance LZ
  watchID = geolocation.watchPosition(watchLocation, locationError, {
    timeout: 60 * 1000
  });

  function watchLocation(position) {
      currentLat = position.coords.latitude;
      currentLong = position.coords.longitude;
      console.log("Current Latitude: " + position.coords.latitude,
                  "Current Longitude: " + position.coords.longitude);
      distanceLabel.text = distance(currentLat,currentLong,lzLat,lzLong) + " km";
  }
}



//update view based on vertical speed and altitude
function pickLayout(fallingSpeed,height){
  if (fallingSpeed >= 80*0.911344415){
    verSpeedElem.style.display = "inline";
    verSpeedLabel.style.display = "inline";
    safeColor.style.display = "inline";
    distanceLabel.style.display = "none";
    distanceElem.style.display = "none";
    if(height>5000){
      safeColor.style.fill="green";
    } else if (height>3500) {
      safeColor.style.fill="orange";
    } else {
      safeColor.style.fill="red";
    };
  } else{
    verSpeedElem.style.display = "none";
    verSpeedLabel.style.display = "none";
    safeColor.style.display = "none";
    distanceLabel.style.display = "inline";
    distanceElem.style.display = "inline";
    if ((fallingSpeed>0)&&(height<150)){
      endSkydive();
    }
  }
}

//stop all monitors and close page
function endSkydive(){
  exercise.stop();
  bar.stop();
  geolocation.clearWatch(watchID);
  switchPage('end', true);
}


//calculate falling speed in km/h
function speedFromAltitude(current, previous){
  return (current-previous)*1.09728;
}

// Converts pressure in millibars to altitude in feet
// https://en.wikipedia.org/wiki/Pressure_altitude
// from https://github.com/Fitbit/sdk-altimeter
function altitudeFromPressure(pressure) {
  return Math.round((1 - (pressure/1013.25)**0.190284)*145366.45);
}


// calculates distance between 2 coordinates in km with 2 decimals
// from https://www.geodatasource.com/developers/javascript
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
    dist = dist * 1.609344;
    dist = Math.round(dist*100)/100;
    return dist;
  }
}
