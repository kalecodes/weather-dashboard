var currentWeatherContainer = document.getElementById("currentContainer");
var dailyWeatherContainer = document.getElementById("dailyContainer");
var cityNameEl = document.getElementById("cityNameDisplay")


var lat = "37.5385087";
var lon = "-77.43428";

//function that makes request to server
var getWeatherData = function(city) {
    //apil url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=f0ae06afe6fabb93ea6866f6b722fa6a";

    //make a request to the apiURL
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //send response data to displayWeather function

                console.log("Response successful");
                console.log(data);
            });
        } else {
            alert("Error: Weather data not found");
        }
    }).catch(function(error) {
        alert("Unable to connect to OpenWeather")
    })
};


//create form submit handler and pass input to API
var searchEl = document.getElementById("searchEl");
var searchBtn = document.getElementById("searchBtn");

var formSubmitHandler = function(event) {
    event.preventDefault();

    var cityName = searchEl.value.trim();
    //check if city has been entered and pass city name to to translate function
    if (cityName) {
        translateLoc(cityName);
        searchEl.value = "";
    } else {
        alert("Please enter a US city name.")
    }
};
searchBtn.addEventListener("click", formSubmitHandler);

//create a function to display weather data 
var displayWeather = function(cityName, current, daily) {
    if (current.length === 0) {
        currentWeatherContainer.textContent = "No current weather data found.";
        return;
    }
    if (daily.length === 0) {
        dailyWeatherContainer.textContent = "No daily forecast data found.";
    }
    //clear searchEl field and display cityName on page
    searchEl.textContent = "";
    cityNameEl.textContent = cityName;
}

getWeatherData();