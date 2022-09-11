const axios = require("axios");
const HttpError = require("../models/http-error");

var ACCESS_TOKEN = process.env.MAPBOX_API;

async function getCoordsForAddress(address) {
  var url = await axios.get(
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(address) +
      ".json?access_token=" +
      ACCESS_TOKEN +
      "&limit=1"
  );

  const data = url.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "could not found location for the  specified location",
      422
    );
    throw error;
  }
  const coordinates = {
    lat: data.features[0].center[1],
    lng: data.features[0].center[0],
  };

  return coordinates;
}

module.exports = getCoordsForAddress;
