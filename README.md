# node-red-contrib-covid-germany-incidents

A node to receive the current incident value of your area in germany

## DISCLAIMER

This node does not guarantee for anything, but that it tries its best to read the data the "Robert Koch Institute (RKI)" and the "Deutsche Interdisziplinäre Vereinigung für Intensiv- und Notfallmedizin (DIVI)" provides. Also those institutions are in no way whatsoever part of the development of this node. We are just using the data from the APIs, they provide.

## How is it working?

Add a covid-local-incidents or covid-local-icus node to your flow, go to the settings and configure the name and the region, where you want to get the data from.
Everytime, the node gets any input message, it will request new data and send it to the output. Please do not flood the api, but only send very few messages. (I recommend once a day)

My Idea is, that I want to display todays incidents value on my dashboard, so I don't need to open the rki dashboard, that is very resource hungry.

## Which values do I get?

### covid-local-incidents

I decided to get the incidents per 100k inhabitants for the selected region and the state, this region belongs to. Also the name of the region and the state are being passed along. This looks like:

```json
{
  "region_7_day_incidents": 15,
  "state_7_day_incidents": 16,
  "region_name": "Erlangen-Höchstadt",
  "state_name": "Bayern"
}
```

### covid-local-icus

```json
{
  "sites_count": 2,
  "units_used": 122,
  "units_free": 18,
  "units_free_percent": 12.8571428571429,
  "units_total": 140,
  "covid_cases": 14,
  "covid_cases_ventilated": 13,
  "covid_cases_ventilated_percent": 92,
  "covid_cases_percent": 11.47541,
  "region_name": "SK Würzburg",
  "state_name": "Bayern",
  "date": "14.04.2021 12:15 Uhr"
}
```

### covid-regional-icus

The same as covid-local-icus but as a summary for a whole "Bundesland".

### Why these values?

The german government uses these values to base their rules on them, so they are probably the most signifikant values for the german population these days.
