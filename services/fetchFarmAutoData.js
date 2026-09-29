// /* ============================================================
//    FETCH FARM AUTO DATA — orchestrates GPS lookup + weather.
//    Set your Google Maps API key in /shared/config.js:
//        window.BV_CONFIG = { GOOGLE_MAPS_API_KEY: "your_key_here" };
//    ============================================================ */
// import { fetchLocationFromGps } from "./location.js";
// import { fetchWeatherAndClimate } from "./weather.js";

// const PLACEHOLDER = "your_google_maps_api_key_here";

// export function getApiKeyError() {
//   const apiKey = (window.BV_CONFIG && window.BV_CONFIG.GOOGLE_MAPS_API_KEY || "").trim();
//   if (!apiKey || apiKey === PLACEHOLDER) {
//     return "Google API key not set. Open shared/config.js and paste your key into BV_CONFIG.GOOGLE_MAPS_API_KEY.";
//   }
//   return null;
// }

// export async function fetchFarmAutoData() {
//   const err = getApiKeyError();
//   if (err) throw new Error(err);
//   const apiKey = window.BV_CONFIG.GOOGLE_MAPS_API_KEY.trim();
//   const location = await fetchLocationFromGps(apiKey);
//   const weather  = await fetchWeatherAndClimate(location.latitude, location.longitude, apiKey);
//   return { state: location.state, district: location.district, village: location.village,
//            pinCode: location.pinCode, formattedAddress: location.formattedAddress, ...weather };
// }







import { fetchLocationFromGps } from "./location.js";
import { fetchWeatherAndClimate } from "./weather.js";

export async function fetchFarmAutoData() {
  const location = await fetchLocationFromGps();

  const weather = await fetchWeatherAndClimate(
    location.latitude,
    location.longitude
  );

  return {
    state: location.state,
    district: location.district,
    village: location.village,
    pinCode: location.pinCode,
    formattedAddress: location.formattedAddress,
    ...weather
  };
}