const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function matchIndianState(name) {
  if (!name) return "";
  const normalized = name.replace(/^State of\s+/i, "").trim();
  const exact = INDIAN_STATES.find(s => s.toLowerCase() === normalized.toLowerCase());
  if (exact) return exact;
  const partial = INDIAN_STATES.find(
    s => normalized.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(normalized.toLowerCase())
  );
  return partial || normalized;
}

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }),
      err => {
        const messages = {
          1: "Location permission denied. Allow location access in your browser, then click Retry.",
          2: "Location unavailable. Check that GPS / location services are enabled.",
          3: "Location request timed out. Please try again.",
        };
        reject(new Error(messages[err.code] || err.message || "Could not get GPS location."));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 120000, ...options }
    );
  });
}

function getComponent(components, ...types) {
  for (const type of types) {
    const match = components.find(c => c.types.includes(type));
    if (match?.long_name) return match.long_name;
  }
  return "";
}

function parseAddressComponents(components) {
  return {
    state: getComponent(components, "administrative_area_level_1"),
    district: getComponent(components, "administrative_area_level_2", "administrative_area_level_3"),
    village: getComponent(components, "locality", "sublocality", "sublocality_level_1", "neighborhood", "administrative_area_level_3"),
    pinCode: getComponent(components, "postal_code"),
  };
}

// export async function reverseGeocode(latitude, longitude, apiKey) {
//   const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
//   url.searchParams.set("latlng", `${latitude},${longitude}`);
//   url.searchParams.set("key", apiKey);
//   url.searchParams.set("language", "en");
//   url.searchParams.set("result_type", "street_address|locality|postal_code|administrative_area_level_2|administrative_area_level_1");

//   const res = await fetch(url);
//   const data = await res.json();

//   if (data.status !== "OK" || !data.results?.length) {
//     throw new Error(data.error_message || `Google Geocoding failed (${data.status}).`);
//   }

//   const result =
//     data.results.find(r => r.types.includes("postal_code")) ||
//     data.results.find(r => r.types.includes("locality")) ||
//     data.results[0];

//   const parsed = parseAddressComponents(result.address_components);
//   return {
//     ...parsed,
//     state: matchIndianState(parsed.state),
//     formattedAddress: result.formatted_address,
//   };
// }


export async function reverseGeocode(latitude, longitude) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("Could not determine location.");
  }

  const data = await res.json();
  const addr = data.address || {};

  return {
    state: matchIndianState(addr.state || ""),
    district: addr.county || addr.state_district || "",
    village: addr.village || addr.town || addr.city || "",
    pinCode: addr.postcode || "",
    formattedAddress: data.display_name || ""
  };
}

export async function fetchLocationFromGps(apiKey) {
  const { latitude, longitude } = await getCurrentPosition();
  // const address = await reverseGeocode(latitude, longitude, apiKey);
  const address = await reverseGeocode(latitude, longitude);
  return { latitude, longitude, ...address };
}
