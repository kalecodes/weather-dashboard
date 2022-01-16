var currentWeatherContainer = document.getElementById("currentContainer");
var dailyWeatherContainer = document.getElementById("dailyContainer");
var dailyParentContainer = document.getElementById("dailyParentEl");
var dailyHeader = document.getElementById("dailyHeader");
var searchEl = document.getElementById("searchEl");
var searchBtn = document.getElementById("searchBtn");
var historyList = document.getElementById("historyList");
var historyTitle = document.getElementById("historyTitle");
var searchHistory = [];

var d = (new Date()).getDate();
var m = (new Date()).getMonth() +1;
var y = (new Date()).getFullYear();

//display current weather data in currentContainer
var displayCurrent = function(cityName, data) {
    //clear previous data 
    currentWeatherContainer.textContent = "";
    
    //create current day header element
    var currentSpan = document.createElement("span");
    currentSpan.setAttribute("style", "display:flex; align-items:center;");
    var currentHeader = document.createElement("h2");
    currentHeader.setAttribute("style","display:inline");
    currentHeader.setAttribute("id", "cityNameDisplay");
    currentHeader.setAttribute("class", "display-4")
    // currentHeader.setAttribute("class", "text-2xl");
    var currentIcon = document.createElement("img");
    currentIcon.setAttribute("style", "display:inline")
    currentIcon.setAttribute("id", "symbolEl");

    currentSpan.appendChild(currentHeader);
    currentSpan.appendChild(currentIcon);
    currentWeatherContainer.appendChild(currentSpan);

    var symbolEl = document.getElementById("symbolEl");
    var cityNameEl = document.getElementById("cityNameDisplay");
    
    //display current day info to the page 
    symbolEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
    cityNameEl.textContent = cityName + " (" + m + "/" + d + "/" + y + ") ";
    
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.current.temp + " °F";

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + " %";

    var uvEl = document.createElement("span");
    uvEl.textContent = "UV Index: " + data.current.uvi;
    uvEl.setAttribute("class", "p-2 col-6 col-md-3 col-lg-2 col-xxl-1 border border-primary rounded")
    //need to add if for coloring of element
    if (data.current.uvi <= 2.5) {
        uvEl.setAttribute("style", "background-color: forestgreen; color: white")
    } else if (data.current.uvi <= 5) {
        uvEl.setAttribute("style", "background-color: yellow;")
    } else if (data.current.uvi <= 7.5) {
        uvEl.setAttribute("style", "background-color: orange;")
    } else if (data.current.uvi <= 10) {
        uvEl.setAttribute("style", "background-color: crimson; color: white;")
    } else {uvEl.setAttribute("style", "background-color: fuchsia;")}

    currentWeatherContainer.appendChild(tempEl);
    currentWeatherContainer.appendChild(windEl);
    currentWeatherContainer.appendChild(humidityEl);
    currentWeatherContainer.appendChild(uvEl);
}

var displayDaily = function(data) {
    //clear previous data
    dailyWeatherContainer.textContent = "";
    dailyHeader.textContent = "";

    //create header element
    dailyHeader.textContent = "5-Day Forecast:";

    for (i = 0; i < 5; i++) {
        var dailyCard = document.createElement("div");
        dailyCard.setAttribute("class", "col-12 col-md-6 col-lg-2 border border-info rounded p-1")

        var dailyDate = document.createElement("h5");
        dailyDate.textContent = "(" + m + "/" + (d + (i + 1)) + "/" + y + ")";

        var dailySymbol = document.createElement("img")
        dailySymbol.setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");

        var dailyTemp = document.createElement("p");
        dailyTemp.textContent = "Temp: " + data.daily[i].temp.day + " °F";
    
        var dailyWind = document.createElement("p");
        dailyWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
    
        var dailyHumidity = document.createElement("p");
        dailyHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";

        dailyCard.appendChild(dailyDate);
        dailyCard.appendChild(dailySymbol);
        dailyCard.appendChild(dailyTemp);
        dailyCard.appendChild(dailyWind);
        dailyCard.appendChild(dailyHumidity);
        
        dailyWeatherContainer.appendChild(dailyCard);
    }
}


//function that makes request to server
var getWeatherData = function(cityName, latitude, longitude) {

    //apil url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=f0ae06afe6fabb93ea6866f6b722fa6a";

    //make a request to the apiURL
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //send response data to displayWeather function
                displayCurrent(cityName, data);
                displayDaily(data);
            });
        } else {
            alert("Error: Weather data not found");
        }
    }).catch(function(error) {
        alert("Unable to connect to OpenWeather")
    })
};

//translate city name into latitude and longitutde
var translateLoc = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=f0ae06afe6fabb93ea6866f6b722fa6a";

    //make request to the apiURL
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(locationData) {
                var latitude = locationData[0].lat;
                var longitude = locationData[0].lon;
                getWeatherData(cityName, latitude,longitude)
            })
        } else {
            alert("Error: Could not find city coordinates")
        }
    }).catch(function(error) {
        alert("Unable to connect to OpenWeather geocoding")
    })
}

var displayHistory = function(searchHistory) {
    for (i = 0; i < searchHistory.length; i++) {
        var recentCityEl = document.createElement("li");
        recentCityEl.setAttribute("class", "border border-info rounded p-2 m-2");
        recentCityEl.setAttribute("id", "recent-item" + i);
        recentCityEl.textContent = searchHistory[i];
        historyTitle.textContent = "Recent Search History:"
        historyList.prepend(recentCityEl);
    }
}

//add searched city to history list
var addToHistory = function(cityName) {
    if (searchHistory.length > 11) {
        searchHistory.shift();
    }
    searchHistory.push(cityName);
    localStorage.setItem("searches", JSON.stringify(searchHistory));
    loadSearchHistory();
}

//create form submit handler and pass input to API
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    var cityName = searchEl.value;
    searchEl.value = "";
    //check if city has been entered and pass city name to to translate function
    if (cityName) {
        //clear all previous data 
        //RUN FUNCTION CHAIN TO DISPLAY SEARCH RESULTS
        translateLoc(cityName);
        addToHistory(cityName);
        loadSearchHistory();
    } else {}
};

searchBtn.addEventListener("click", formSubmitHandler);

var loadSearchHistory = function() {
    historyList.textContent = "";
    searchHistory = [];
    var storedHistory = JSON.parse(localStorage.getItem("searches"))
    for (i = 0; i < storedHistory.length; i++) {
        searchHistory.push(storedHistory[i]);
    }
    displayHistory(searchHistory);
}

document.addEventListener("load", loadSearchHistory());

var historyClickHandler = function(event) {
    var cityName = event.target.textContent;

    if (cityName) {
        translateLoc(cityName);
    } else {}
};

historyList.addEventListener("click", historyClickHandler);