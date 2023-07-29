import { FreeAtHome } from '@busch-jaeger/free-at-home';
import fetch from 'cross-fetch';

const freeAtHome = new FreeAtHome();
freeAtHome.activateSignalHandling();

// credentials to access weather API.
var username = 'geraldmadlmayr_madlmayr'
var password = 'maZM24tCv6'

// Definition of the Bearer Token we get for OAuth
interface Token { access_token: string, token_type: string }

// Definition of the Weather Object we get from the API
interface WeatherResponse { version: string, user: string, dateGenerated: Date, status: string, data: WeatherData[] }
interface WeatherData { parameter: string, coordinates: WeatherCoordinate[] }
interface WeatherCoordinate { lat: string, long: string, dates: WeatherDateDataObj[] }
interface WeatherDateDataObj { date: Date, value: number }

// Basic Guard Function
const isToken = (data: any): data is Token => {
  return typeof data.access_token == 'string' && typeof data.token_type == 'string'
}

const isWeatherResponse = (data: any): data is WeatherResponse => {
  return typeof data.version == 'string' && typeof data.user == 'string'
}

async function main() {

  const meteomatics = await freeAtHome.createWeatherStationDevice("VirtualWeatherStation", "meteomatics Wetter")
  meteomatics.wind.setAutoKeepAlive(true);
  meteomatics.wind.setAutoConfirm(true);
  meteomatics.wind.isAutoConfirm = true;
  meteomatics.temperature.setAutoKeepAlive(true);
  meteomatics.temperature.setAutoConfirm(true);
  meteomatics.temperature.isAutoConfirm = true;
  meteomatics.rain.setAutoKeepAlive(true);
  meteomatics.rain.setAutoConfirm(true);
  meteomatics.rain.isAutoConfirm = true;

  // we have 500 queries per day, so running ever 3 minutes
  var minutes = 3, the_interval = minutes * 60 * 1000;
  setInterval(async function () {

    if (username == '') {
      console.warn('Username is not set. Please enter your password in the settings');
      return;
    }

    if (password == '') {
      console.warn('Password is not set. Please enter your password in the settings');
      return;
    }

    console.log("Update Data.")
    await fetchAccessToken().then(token => fetchWeatherData(token).then(function (weatherResponse) {

      let temperatureValue = weatherResponse.data.find(data => data.parameter == "t_2m:C")?.coordinates[0].dates[0].value;
      if (temperatureValue !== undefined) {
        meteomatics.temperature.setTemperature(temperatureValue);
        console.log('Temperature is ${temperatureValue}');
      } else {
        console.log('Temperature is not defined');
      }

      let rainValue = weatherResponse.data.find(data => data.parameter == "precip_1h:mm")?.coordinates[0].dates[0].value;
      if (rainValue !== undefined) {
        meteomatics.rain.setIsRaining(rainValue > 1);
        console.log('Rain is ${(rainValue >1))}');
      } else {
        console.log('Rain is not defined');
      }

      let windSpeedValue = weatherResponse.data.find(data => data.parameter == "wind_speed_10m:ms")?.coordinates[0].dates[0].value;
      if (windSpeedValue !== undefined) {
        meteomatics.wind.setWindSpeed(windSpeedValue);
        console.log('Wind is  ${windSpeedValue} m/s');
      } else {
        console.log('Wind is not defined');
      }
    }).catch(function (err) {
      console.log('Error on updating values of weather station', err);
    }));
  }, the_interval);
}

/**
 * fetchAccessToken fetches the OAuth2 token from meteomatics for getting the weather data in a 2nd step
 * The Token is value for 2 h, we we pull one for every call. 
 * @returns OAuth2 Token as a String
 */
async function fetchAccessToken() {
  const resp = await fetch('https://login.meteomatics.com/api/v1/token', {
    method: 'GET', headers: { 'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64') }
  });
  const jsonResponse = await resp.json();
  // Use Type Guard.
  if (isToken(jsonResponse)) {
    return jsonResponse.access_token;
  } else {
    throw Error('Parsed string is not an AccessToken.');
  }
}

/** 
 * Method for Fetching the Weather Data from meteomatics
 * @returns WeatherResponseObject with the most current Data. 
 */
async function fetchWeatherData(oauth2Token: string) {

  // Format needs to be 2023-07-26T12:19:00Z
  let dateString = new Date().toISOString();
  let url = "https://api.meteomatics.com/${dateString}/t_2m:C,precip_1h:mm,wind_speed_10m:ms/48.17496316252979,11.459006501063644/json?access_token=${oauth2Token}";
  const resp = await fetch(url, {
    method: 'GET'
  });
  const jsonResponse = await resp.json();
  // Use Type Guard.
  if (isWeatherResponse(jsonResponse)) {
    return jsonResponse;
  } else {
    throw Error('Parsed string is not an WeatherResponse.');
  }
}

main();

// Get notified about changes in the configuration of the add on
//#################################################################################

import { AddOn } from '@busch-jaeger/free-at-home';

const metaData = AddOn.readMetaData();

const addOn = new AddOn.AddOn(metaData.id);

addOn.on("configurationChanged", (configuration: AddOn.Configuration) => {
  // TODO: Remove, as this would also log out the password.
  console.log(configuration);
  username = configuration.default?.items?.["Username"] ?? "";
  password = configuration.default?.items?.["Password"] ?? "";
})
addOn.connectToConfiguration();