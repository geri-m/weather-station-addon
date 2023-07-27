import { FreeAtHome } from '@busch-jaeger/free-at-home';
import fetch from 'cross-fetch';

const freeAtHome = new FreeAtHome();
freeAtHome.activateSignalHandling();

// credentials to access weather API.
const username = 'geraldmadlmayr_madlmayr'
const password = 'maZM24tCv6'

// Defintion of the Bearer Token we get for OAuth
interface Token { access_token: string, token_type: string }

// Defintion of the Weather Object we get from the API

// {"version":"3.0","user":"geraldmadlmayr_madlmayr","dateGenerated":"2023-07-26T15:06:58Z","status":"OK","data":[
//    {"parameter":"t_2m:C","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":9.4}]}]},
//    {"parameter":"precip_1h:mm","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":0.23}]}]},
//    {"parameter":"wind_speed_10m:ms","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":3.2}]}]},
//    {"parameter":"wind_dir_10m:d","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":340.2}]}]},
//    {"parameter":"wind_gusts_10m_1h:ms","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":9.6}]}]},

interface WeatherResponse { version: string, user: string, dateGenerated: Date, status: string, data: WeatherData[] }
interface WeatherData { parameter: string, coordinates: WeatherCoordindate[] }
interface WeatherCoordindate { lat: string, long: string, dates: WeatherDateDataObj[] }
interface WeatherDateDataObj { date: Date, value: number }

// Guard Function
const isToken = (data: any): data is Token => {
  return typeof data.access_token == 'string' && typeof data.token_type == 'string'
}

const isWeatherResponse = (data: any): data is WeatherResponse => {
  return typeof data.version == 'string' && typeof data.user == 'string'
}

async function main() {

  // URL for Weather: https://api.meteomatics.com/2023-07-26T12:19:00Z/t_2m:C,precip_1h:mm,wind_speed_10m:ms,wind_dir_10m:d,wind_gusts_10m_1h:ms/48.17496316252979,11.459006501063644/json?access_token=<token>
  // Benutzer: geraldmadlmayr_madlmayr
  // Kennwort: maZM24tCv6

  // https://www.meteomatics.com/en/api/request/api-requests-oauth-authentification/
  
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

  // we have 500 querys per day, so running ever 3 mintues
  var minutes = 3, the_interval = minutes  * 60  * 1000;
  setInterval(async function () {
    console.log("3 Minutes.")
    fetchAccessToken().then(token => fetchWeatherData(token).then(function (weatherResponse) {

      let temperatureValue = weatherResponse.data.find(data => data.parameter == "t_2m:C")?.coordinates[0].dates[0].value;
      if(temperatureValue !== undefined){
        meteomatics.temperature.setTemperature(temperatureValue);
        console.log('Temperatur is ' + temperatureValue + " C");
      } else {
        console.log('Temperatur is not defined');
      }

      let rainValue = weatherResponse.data.find(data => data.parameter == "precip_1h:mm")?.coordinates[0].dates[0].value;
      if(rainValue !== undefined){
        meteomatics.rain.setIsRaining(rainValue > 1);
        console.log('Rain is ' + (rainValue >1));
      } else {
        console.log('Rain is not defined');
      }

      let windSpeedValue = weatherResponse.data.find(data => data.parameter == "wind_speed_10m:ms")?.coordinates[0].dates[0].value;
      if(windSpeedValue !== undefined){
        meteomatics.wind.setWindSpeed(windSpeedValue);
        console.log('Wind is ' + (windSpeedValue) + "m/s");
      } else {
        console.log('Wind is not defined');
      }
    }).catch(function (err) {
      console.log('something went wrong', err);
    }));
  }, the_interval);
}

/**
 * fetchAccessToken fetches the OAuth2 token from meteomatics for getting the weather data in a 2nd step
 * The Token is value for 2 h, we we pull one for every call. 
 * @returns OAuth2 Token as a String
 */
function fetchAccessToken() {
  return fetch('https://login.meteomatics.com/api/v1/token', {
    method: 'GET', headers: { 'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64') }
  }).then((resp) =>
    resp.json()
  ).then((data) => {
    // Use Type Guard.
    if (isToken(data)) {
      // With the Type Guard the assignement of the 
      const phoebe: Token = data;
      return phoebe.access_token;
    } else {
      throw Error('Parsed string is not an AccessToken 1.')
    }
  });
}



/** 
 * Method for Fetching the Weather Data from meteomatics
 * @returns WeatherResponseObjcect with the most current Data. 
 */
function fetchWeatherData(oauth2Token: string) {

  // Fomat needs to be 2023-07-26T12:19:00Z
  let dateString = new Date().toISOString(); 
  var url = "https://api.meteomatics.com/" + dateString + "/t_2m:C,precip_1h:mm,wind_speed_10m:ms/48.17496316252979,11.459006501063644/json?access_token=" + oauth2Token;
  return fetch(url, {
    method: 'GET'
  }).then(resp => {
    return resp.json();
  }).then(function (data) {
    // Use Type Guard.
    if (isWeatherResponse(data)) {
      // With the Type Guard the assignement of the 
      const phoebe: WeatherResponse = data;
      return phoebe
    } else {
      throw Error('Parsed string is not an WeatherResponse.')
    }
  })
}

main();