// /** Google Weather API — current conditions */
// export async function fetchGoogleCurrentWeather(latitude, longitude, apiKey) {
//   const url = new URL("https://weather.googleapis.com/v1/currentConditions:lookup");
//   url.searchParams.set("key", apiKey);
//   url.searchParams.set("location.latitude", String(latitude));
//   url.searchParams.set("location.longitude", String(longitude));
//   url.searchParams.set("unitsSystem", "METRIC");
//   url.searchParams.set("languageCode", "en");

//   const res = await fetch(url);
//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     const msg = data?.error?.message || data?.error_message || `Google Weather API error (${res.status})`;
//     throw new Error(msg);
//   }

//   return {
//     temperature: data.temperature?.degrees ?? null,
//     humidity: data.relativeHumidity ?? null,
//     description: data.weatherCondition?.description?.text ?? "",
//     precipitationMm: data.precipitation?.qpf?.quantity ?? 0,
//     thunderstormProbability: data.thunderstormProbability ?? 0,
//   };
// }

// /** Annual rainfall (mm) from Open-Meteo archive — supplements Google Weather */
// export async function fetchAnnualRainfallMm(latitude, longitude) {
//   const year = new Date().getFullYear() - 1;
//   const url = new URL("https://archive-api.open-meteo.com/v1/archive");
//   url.searchParams.set("latitude", String(latitude));
//   url.searchParams.set("longitude", String(longitude));
//   url.searchParams.set("start_date", `${year}-01-01`);
//   url.searchParams.set("end_date", `${year}-12-31`);
//   url.searchParams.set("daily", "precipitation_sum");
//   url.searchParams.set("timezone", "auto");

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Could not estimate annual rainfall for this location.");

//   const data = await res.json();
//   const daily = data.daily?.precipitation_sum ?? [];
//   const total = daily.reduce((sum, mm) => sum + (mm ?? 0), 0);
//   return Math.round(Math.min(Math.max(total, 200), 2000));
// }

// export function inferFloodDroughtHistory(annualRainMm) {
//   if (annualRainMm < 450) return "Chronic drought-prone area";
//   if (annualRainMm < 650) return "Occasional droughts";
//   if (annualRainMm > 2400) return "Chronic flood-prone area";
//   if (annualRainMm > 1700) return "Occasional floods";
//   return "None reported";
// }

// export async function fetchWeatherAndClimate(latitude, longitude, apiKey) {
//   const [current, annualRainMm] = await Promise.all([
//     fetchGoogleCurrentWeather(latitude, longitude, apiKey),
//     fetchAnnualRainfallMm(latitude, longitude).catch(() => 850),
//   ]);

//   return {
//     temp: current.temperature != null ? String(Math.round(current.temperature)) : "",
//     humidity: current.humidity != null ? String(current.humidity) : "",
//     rainfall: String(annualRainMm),
//     floodDroughtHistory: inferFloodDroughtHistory(annualRainMm),
//     weatherDescription: current.description,
//   };
// }























export async function fetchCurrentWeather(latitude, longitude) {
const url = new URL("https://api.open-meteo.com/v1/forecast");

url.searchParams.set("latitude", latitude);
url.searchParams.set("longitude", longitude);
url.searchParams.set(
"current",
"temperature_2m,relative_humidity_2m"
);

const res = await fetch(url);

if (!res.ok) {
throw new Error("Could not fetch weather data.");
}

const data = await res.json();

return {
temperature: data.current?.temperature_2m ?? null,
humidity: data.current?.relative_humidity_2m ?? null,
description: "Current Conditions",
};
}

export async function fetchAnnualRainfallMm(latitude, longitude) {
const year = new Date().getFullYear() - 1;

const url = new URL("https://archive-api.open-meteo.com/v1/archive");

url.searchParams.set("latitude", String(latitude));
url.searchParams.set("longitude", String(longitude));
url.searchParams.set("start_date", `${year}-01-01`);
url.searchParams.set("end_date", `${year}-12-31`);
url.searchParams.set("daily", "precipitation_sum");
url.searchParams.set("timezone", "auto");

const res = await fetch(url);

if (!res.ok) {
throw new Error("Could not estimate annual rainfall.");
}

const data = await res.json();

const daily = data.daily?.precipitation_sum ?? [];

const total = daily.reduce((sum, mm) => sum + (mm ?? 0), 0);

return Math.round(Math.min(Math.max(total, 200), 2000));
}

export function inferFloodDroughtHistory(annualRainMm) {
if (annualRainMm < 450) return "Chronic drought-prone area";
if (annualRainMm < 650) return "Occasional droughts";
if (annualRainMm > 2400) return "Chronic flood-prone area";
if (annualRainMm > 1700) return "Occasional floods";
return "None reported";
}

export async function fetchWeatherAndClimate(latitude, longitude) {
const [current, annualRainMm] = await Promise.all([
fetchCurrentWeather(latitude, longitude),
fetchAnnualRainfallMm(latitude, longitude).catch(() => 850),
]);

return {
temp:
current.temperature != null
? String(Math.round(current.temperature))
: "",


humidity:
  current.humidity != null
    ? String(current.humidity)
    : "",

rainfall: String(annualRainMm),

floodDroughtHistory:
  inferFloodDroughtHistory(annualRainMm),

weatherDescription:
  current.description,


};
}

