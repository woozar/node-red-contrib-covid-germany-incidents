# node-red-contrib-covid-germany-incidents
A node to receive the current incident value of your area in germany

# DISCLAIMER

This node does not guarantee for anything but that it tries its best to read the data the Robert Koch Institute provides. Also the Robert Koch Institute is in no way whatsoever part of the development of this node. We are just using the data, they provide.

# How is it working?

Add a covid-local-incidents nodeto your flow, go to the settings andconfigure the name and the region, where you want to get the data from.
Everytime, the node gets any input message, it will request new data and send it to the output. Please do not flood the api, but only send very few messages. (I recommend once a day)

My Idea is, that I want to display todays incidents value on my dashboard, so I don't need to open the rki dashboard, that is very resource hungry.

# Which values do I get?

I decided to get the incidents per 100k inhabitants for the selected region and the state, this region belongs to. Also the name of the region and the state are being passed along. This looks like:

```json
{
  "region_7_day_incidents": 15,
  "state_7_day_incidents": 16,
  "region_name": "Erlangen-Höchstadt",
  "state_name": "Bayern"
}
```

## Why these values?

The german government uses these values to base their rules on them, so they are probably the most signifikant values for the german population these days.
