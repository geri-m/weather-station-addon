# weather-station-addon

Addon for free@home to simulate a virtual weather station with data from a public weather API. 

# References

[Docu Busch und Jaeger](https://busch-jaeger.github.io/free-at-home-addon-development-kit-documentation-preview/)

[Sample App](https://github.com/Busch-Jaeger/node-free-at-home-example)

[Free@Home Lib](https://github.com/Busch-Jaeger/node-free-at-home)

[ABB Portal](https://developer.eu.mybuildings.abb.com/tutorials)

setAutoKeepAlive: Every 2 min this [method](https://github.com/Busch-Jaeger/node-free-at-home/blob/e6a467ebb1fd31685c84b3fb27e777232ed5fd9f/src/freeAtHomeApi.ts#L275) is called automatically.

isAutoConfirm automatically sets "OutputDataPoints". (?) using this [method](https://github.com/Busch-Jaeger/node-free-at-home/blob/e6a467ebb1fd31685c84b3fb27e777232ed5fd9f/src/freeAtHomeApi.ts#L215)

# Meteomatric 

* API Call: https://api.meteomatics.com/2023-07-26T12:19:00Z/t_2m:C,precip_1h:mm,wind_speed_10m:ms,wind_dir_10m:d,wind_gusts_10m_1h:ms,uv:idx/48.17496316252979,11.459006501063644/json
* username = 'geraldmadlmayr_madlmayr'
* password = 'maZM24tCv6'



