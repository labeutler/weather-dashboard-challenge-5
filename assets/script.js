//Front end element variables here
var cities = [];
var formEl = document.querySelector("#cityForm");
var inputEl = document.querySelector("#city");
var weatherEl = document.querySelector("#currentWeatherContainer");
var citySearchEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var fiveDayContainerEl = document.querySelector("#fivedayContainer");
var pastSearchBtnEl = document.querySelector("#pastSearchBtns");

//Form Handler to search for city
var formHandler = function (event) {
    event.preventDefault();
    var city = inputEl.value.trim();
    if (city) {
        getWeather(city);
        get5Day(city);
        cities.unshift({ city });
        inputEl.value = "";
    } else {
        alert("Required: Please enter a city name.");
    }
    saveSearch();
    pastSearch(city);
}

//Get weather function
var getWeather = function (city) {
    //Fetch api to get weather
    var apiKey = 'd2692fd833256c6caad1fc0c4c32881a';
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayWeather(data, city);
            });
        });
};
//Display weather
var displayWeather = function (weather, searchCity) {
    weatherEl.textContent = "";
    citySearchEl.textContent = searchCity;

    //Pull date to display for city
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMMM D, YYYY") + ") ";
    citySearchEl.appendChild(currentDate);

    //Pull weather icon details
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchEl.appendChild(weatherIcon);

    //Pull current temp to display
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    //Pull current wind to display
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    //Pull current humidity to display
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    //Append containers
    weatherEl.appendChild(temperatureEl);
    weatherEl.appendChild(windSpeedEl);
    weatherEl.appendChild(humidityEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    // getUvIndex(lat,lon)
}
//Save searches function
var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};
//Added event listener
formEl.addEventListener("submit", formHandler);

//Five Day Forcast function
var get5Day = function (city) {
    var apiKey = 'd2692fd833256c6caad1fc0c4c32881a';
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayFiveDay(data);
                console.log(data)
            });
        });
};


//Display Five Day Forcast
var displayFiveDay = function (weather) {
    fiveDayContainerEl.textContent = ""
    forecastTitle.textContent = "Five-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];
        var forecastEl = document.createElement("div");

        //creates a vertical display of forecasted days
        forecastEl.classList = "card bg-primary text-light m-2";

        //create date element
        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);


        //create an image element
        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        //append to forecast card
        forecastEl.appendChild(weatherIcon);

        //create temperature span
        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card for temp
        forecastEl.appendChild(forecastTempEl);

        //create wind speed span
        var forecastSpeedEl = document.createElement("span");
        forecastSpeedEl.classList = "card-body text-center";
        forecastSpeedEl.textContent = dailyForecast.wind.speed + " MPH";

        //append to forcast card for wind speed 
        forecastEl.appendChild(forecastSpeedEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

        //append to forecast card
        forecastEl.appendChild(forecastHumEl);

        //append to five day container
        fiveDayContainerEl.appendChild(forecastEl);
    }
}
//Past search result container
var pastSearch = function (pastSearch) {
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchBtnEl.prepend(pastSearchEl);
}
var pastSearchHandler = function (event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        getWeather(city);
        get5Day(city);
    }
}

//Add event listener to recall previous searches.
pastSearchBtnEl.addEventListener("click", pastSearchHandler);
