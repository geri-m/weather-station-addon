# weather-station-addon

Addon for free@home to simulate a virtual weather station with data from a public weather API. 

# References

* [Docu Busch und Jaeger](https://busch-jaeger.github.io/free-at-home-addon-development-kit-documentation-preview/)
* [Sample App](https://github.com/Busch-Jaeger/node-free-at-home-example)
* [Free@Home Lib](https://github.com/Busch-Jaeger/node-free-at-home)
* [ABB Portal](https://developer.eu.mybuildings.abb.com/tutorials)

# Docs Infos

* setAutoKeepAlive: Every 2 min this [method](https://github.com/Busch-Jaeger/node-free-at-home/blob/e6a467ebb1fd31685c84b3fb27e777232ed5fd9f/src/freeAtHomeApi.ts#L275) is called automatically.
* isAutoConfirm automatically sets "OutputDataPoints". (?) using this [method](https://github.com/Busch-Jaeger/node-free-at-home/blob/e6a467ebb1fd31685c84b3fb27e777232ed5fd9f/src/freeAtHomeApi.ts#L215)

# Meteomatric 

Docu: https://www.meteomatics.com/en/api/request/api-requests-oauth-authentification/

## Request

* API Call: https://api.meteomatics.com/2023-07-26T12:19:00Z/t_2m:C,precip_1h:mm,wind_speed_10m:ms,wind_dir_10m:d,wind_gusts_10m_1h:ms,uv:idx/48.17496316252979,11.459006501063644/json
* username = 'geraldmadlmayr_madlmayr'
* password = 'maZM24tCv6'

## Response

```json
{"version":"3.0","user":"geraldmadlmayr_madlmayr","dateGenerated":"2023-07-26T15:06:58Z","status":"OK","data":[
    {"parameter":"t_2m:C","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":9.4}]}]},
    {"parameter":"precip_1h:mm","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":0.23}]}]},
    {"parameter":"wind_speed_10m:ms","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":3.2}]}]},
    {"parameter":"wind_dir_10m:d","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":340.2}]}]},
    {"parameter":"wind_gusts_10m_1h:ms","coordinates":[{"lat":48.174963,"lon":11.459007,"dates":[{"date":"2023-07-26T12:19:00Z","value":9.6}]}]},
```

# Package.json

I ensure that the same versions from the NPM Pages in this lib are also used in the top-level [Free@Home Lib](https://github.com/Busch-Jaeger/node-free-at-home/blob/master/package.json)
