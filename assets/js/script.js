var currentWeatherContainer = document.getElementById("currentContainer");
var dailyWeatherContainer = document.getElementById("dailyContainer");
var cityNameEl = document.getElementById("cityNameDisplay");
var searchEl = document.getElementById("searchEl");
var searchBtn = document.getElementById("searchBtn");
var symbolEl = document.getElementById("symbolEl");

var d = (new Date()).getDate();
var m = (new Date()).getMonth() +1;
var y = (new Date()).getFullYear();

//display current weather data in currentContainer
var displayCurrent = function(cityName, data) {
    //clear old data
    //cityNameEl.textContent = "";
    //cityNameEl.textContent = "";
    searchEl.textContent = "";

    //display current day info to the page 
    symbolEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png")
    cityNameEl.textContent = cityName + "(" + m + "/" + d + "/" + y + ") ";
    
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.current.temp + " °F";

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + " %";

    var uvEl = document.createElement("span");
    uvEl.textContent = "UV Index: " + data.current.uvi;
    //need to add if for coloring of element

    currentWeatherContainer.appendChild(tempEl);
    currentWeatherContainer.appendChild(windEl);
    currentWeatherContainer.appendChild(humidityEl);
    currentWeatherContainer.appendChild(uvEl);

    console.log(currentWeatherContainer);
}

var displayDaily = function(data) {
    dailyWeatherContainer.textContent = "";

    for (i = 0; i < 5; i++) {
        var dailyCard = document.createElement("div");
        dailyCard.setAttribute("class", "h-11/12 w-1/6 p-1 bg-blue-700")

        var dailyDate = document.createElement("h3");
        dailyDate.textContent = "(" + m + "/" + (d + (i + 1)) + "/" + y + ")";

        var dailySymbol = document.createElement("img")
        dailySymbol.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");

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
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=f0ae06afe6fabb93ea6866f6b722fa6a";

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

//create form submit handler and pass input to API

var formSubmitHandler = function(event) {
  //  event.preventDefault();

    var cityName = searchEl.value;
    //check if city has been entered and pass city name to to translate function
    if (cityName) {
        translateLoc(cityName);
    } else {
        alert("Please enter a US city name.")
    }
};

searchBtn.addEventListener("click", formSubmitHandler);
