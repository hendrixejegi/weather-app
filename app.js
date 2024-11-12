function loadApp() {
  "use strict";

  const key = "df5eb8d925f13ae4cbf7214abf7c49d2";
  const cityInput = document.querySelector("#city-input");
  const searchBtn = document.querySelector("#search-btn");
  const infoContainer = document.querySelector("main");

  searchBtn.addEventListener("click", async () => {
    const city = cityInput.value;
    // if (!city) return;

    // Get data
    const geoRes = await fetch(`
      http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}
    `);
    const data = await geoRes.json();

    let cityData;

    if (data.length <= 0) {
      infoContainer.innerHTML = `${city} not found`; // No data found
    } else if (data.length === 1) {
      cityData = data[0];
      renderWeatherInfo(cityData); // Fetch returned a single data
    } else {
      getUserOption(data);
      document.querySelectorAll(".js-list-button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const { index } = e.target.dataset;
          cityData = data[index];
          renderWeatherInfo(cityData);
        });
      });
    }
  });

  function getUserOption(data) {
    const listContainerElem = document.createElement("ul");
    listContainerElem.classList.add("city-options");

    let optionsHTML = "";
    data.forEach((city, index) => {
      optionsHTML += `
      <li>
        <button class="js-list-button" data-index="${index}">
          ${city.name}, ${city.country}
        </button
      </li>`;
    });

    infoContainer.innerHTML = "";
    infoContainer.appendChild(listContainerElem);
    listContainerElem.innerHTML = optionsHTML;
  }

  async function renderWeatherInfo(cityData) {
    const coordinates = {
      lat: cityData.lat,
      lon: cityData.lon,
    };

    // Get weather info
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${key}`
    );
    const weatherInfo = await weatherRes.json();

    // Generate HTML
    infoContainer.innerHTML = `
      <div class="weather-info">
        <h2 id="location">${weatherInfo.name}, ${weatherInfo.sys.country}</h2>
        <img src="icons/${
          weatherInfo.weather[0].icon
        }.png" alt="Weather Icon" id="weather-icon" />
        <h3 id="temperature">${weatherInfo.main.temp}°C</h3>
        <p id="description">${weatherInfo.weather[0].description}</p>
      </div>

      <div class="additional-info">
        <p>Humidity: <span id="humidity">${
          weatherInfo.main.humidity
        }%</span></p>
        <p>Wind Speed: <span id="wind-speed">${
          weatherInfo.wind.speed
        } km/h</span></p>
        <p>Sunrise: <span id="sunrise">${formatDate(
          weatherInfo.sys.sunrise
        )}</span></p>
        <p>Sunset: <span id="sunset">${formatDate(
          weatherInfo.sys.sunset
        )}</span></p>
      </div>
    `;
  }

  function formatDate(unixCode) {
    const date = new Date(unixCode * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
}
loadApp();
