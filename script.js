const input = document.getElementById("city-input");
const suggestionsList = document.querySelector(".suggestions-list");
const cityNameDisplay = document.getElementById("city-name");
const cityPinDisplay = document.getElementById("city-pin");
const cityStateDisplay = document.getElementById("city-state");
const cityImageDisplay = document.getElementById("city-image");

// Fetch city images data from JSON file
async function fetchCityImages() {
  try {
    const response = await fetch('cities_images.json'); // Load JSON file locally
    if (!response.ok) {
      throw new Error("Failed to load city images JSON file");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching city images:", error);
    return [];
  }
}

// Fetch city suggestions from Geonames API
async function fetchCitySuggestions(query) {
  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?username=ritesh24&name_startsWith=${query}&maxRows=10&featureClass=P&country=IN`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.geonames || [];
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
}

// Display suggestions below the input box
function showSuggestions(cities) {
  suggestionsList.innerHTML = "";

  cities.forEach((city) => {
    const listItem = document.createElement("li");
    listItem.textContent = city.name;
    listItem.addEventListener("click", () => selectCity(city));
    suggestionsList.appendChild(listItem);
  });
}

// Select a city and display info including image from JSON
async function selectCity(city) {
  input.value = city.name;
  suggestionsList.innerHTML = "";
  displayCityInfo(city);

  // Fetch images from JSON and find a matching image
  const cityImages = await fetchCityImages();
  const matchingCity = cityImages.find(item => item.name.toLowerCase() === city.name.toLowerCase() && item.country.toLowerCase() === city.countryCode.toLowerCase());

  // Display image if found, or a placeholder if not
  if (matchingCity && matchingCity.image) {
    cityImageDisplay.src = matchingCity.image;
    cityImageDisplay.alt = `${city.name} image`;
  } else {
    cityImageDisplay.src = "https://via.placeholder.com/300?text=No+Image+Available";
    cityImageDisplay.alt = "No image available";
  }
}

// Display city information
function displayCityInfo(city) {
  cityNameDisplay.textContent = `City: ${city.name}`;
  cityPinDisplay.textContent = `Population: ${city.population}`;
  cityStateDisplay.textContent = `Country: ${city.countryName}`;
}

// Handle input changes for search
input.addEventListener("input", async (e) => {
  const query = e.target.value;
  if (query.length >= 3) {
    const cities = await fetchCitySuggestions(query);
    showSuggestions(cities);
  } else {
    suggestionsList.innerHTML = "";
  }
});
