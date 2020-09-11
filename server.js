const searchTerm = document.querySelector("[data-city-search]");
const locationElement = document.querySelector("[data-location]");
const statusElement = document.querySelector("[data-status]");
const countryElement = document.querySelector("[data-country]");
const dayElement = document.querySelector("[data-day]");
const temperatureElement = document.querySelector("[data-temperature]");
const humidityElement = document.querySelector("[data-humidity]");
const windElement = document.querySelector("[data-wind]");
const iconContainer = document.querySelector(".icon-container");
const defaultValue = document.querySelector(".default");
const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
let initialData = JSON.parse(localStorage.getItem("initialData"));

baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
apiKey = `8485a1c0788cba445595afe61ef60158`;

function setWeatherData(data) {
  if (data.cod == 200) {
    dayElement.textContent = setDate();
    locationElement.textContent = data.name;
    statusElement.textContent = data.weather[0].main;
    temperatureElement.textContent = data.main.temp;
    humidityElement.textContent = data.main.humidity;
    windElement.textContent = data.wind.speed;
    const { icon } = data.weather[0];
    const { country } = data.sys;
    const lower = lowercase(country);
    countryElement.innerHTML = `${data.sys.country} <img src="https://openweathermap.org/images/flags/${lower}.png" alt="">`;
    iconContainer.innerHTML = `<img id="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${data.weather[0].description}" title="${data.weather[0].description}" >`;
    saveRecentSearches(data);
  } else if (data.cod == 404) {
    errHandler();
  }
}

function getWeather(searchTerm) {
  const searchUrl = `${baseUrl}${searchTerm}&units=metric&appid=${apiKey}`;

  const req = fetch(searchUrl);
  req
    .then((res) => res.json())
    .then((data) => {
      setWeatherData(data);
    })
    .catch((err) => console.log(err.message));
}

function errHandler() {
  statusElement.textContent = `City not found. Try a different search`;
  locationElement.textContent = "";
  temperatureElement.textContent = "...";
  humidityElement.textContent = "...";
  windElement.textContent = "...";
  countryElement.innerHTML = "...";
  dayElement.textContent = "...";
}

function saveRecentSearches(data) {
  let currentSearch = {
    location: data.name,
    status: data.weather[0].main,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    icon: data.weather[0],
    country: data.sys.country,
  };
  let searchExists = recentSearches.some(
    (element) => element.location === currentSearch.location
  );
  if (!searchExists) {
    recentSearches.push(currentSearch);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
}

function getRecentSearches(value) {
  let cityExists = recentSearches.find(
    (element) => element.location === capitalize(value)
  );
  if (cityExists) {
    setDataFromLocalStorage(cityExists);
    return true;
  }
}

function setDataFromLocalStorage(data) {
  locationElement.textContent = data.location;
  statusElement.textContent = data.status;
  temperatureElement.textContent = data.temperature;
  humidityElement.textContent = data.humidity;
  windElement.textContent = data.wind;
  iconContainer.innerHTML = `<img id="icon" src="https://openweathermap.org/img/wn/${data.icon.icon}@2x.png" alt="${data.icon.description}" title="${data.icon.description}" >`;
  const lower = lowercase(data.country);
  countryElement.innerHTML = `${data.country} <img src="https://openweathermap.org/images/flags/${lower}.png" alt="">`;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function lowercase(string) {
  return string.toLowerCase();
}

function getCurrentPosition() {
  defaultValue.style.display = "none";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
  exclude=hourly,daily,minutely&units=metric&appid=${apiKey}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setLatData(data);
    });
}

function setLatData(data) {
  dayElement.textContent = setDate();
  locationElement.textContent = data.timezone;
  statusElement.textContent = data.current.weather[0].main;
  temperatureElement.textContent = data.current.temp;
  humidityElement.textContent = data.current.humidity;
  windElement.textContent = data.current.wind_speed;
  const { icon } = data.current.weather[0];
  iconContainer.innerHTML = `<img id="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${data.current.weather[0].description}" title="${data.current.weather[0].description}" >`;
  saveLatData(data);
}

function saveLatData(data) {
  initialData = [];
  let initial = {
    location: data.timezone,
    status: data.current.weather[0].main,
    temperature: data.current.temp,
    humidity: data.current.humidity,
    wind: data.current.wind_speed,
    icon: data.current.weather[0].icon,
    description: data.current.weather[0].description,
  };
  initialData.push(initial);
  localStorage.setItem("initialData", JSON.stringify(initialData));
}

function populatePage(data) {
  locationElement.textContent = data.location;
  statusElement.textContent = data.status;
  temperatureElement.textContent = data.temperature;
  humidityElement.textContent = data.humidity;
  windElement.textContent = data.wind;
  const icon = data.icon;
  iconContainer.innerHTML = `<img id="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${data.description}" title="${data.description}" >`;
}

function setDate() {
  let now = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${date} ${month} ${year}`;
}

function initialLoad() {
  if (initialData) {
    defaultValue.style.display = "none";
    return populatePage(initialData[0]);
  }
  if (recentSearches.length != 0) {
    defaultValue.style.display = "none";
    return setDataFromLocalStorage(recentSearches[recentSearches.length - 1]);
  }
}

searchTerm.addEventListener("change", (e) => {
  defaultValue.style.display = "none";
  if (!getRecentSearches(e.target.value)) {
    getWeather(e.target.value);
  } else {
    getRecentSearches(e.target.value);
  }
});

defaultValue.addEventListener("click", getCurrentPosition);
window.addEventListener("load", initialLoad);
