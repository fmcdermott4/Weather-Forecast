localCities();
// Listening event for city submit button
$("#citySubmit").on("click", cityInput);
// Takes city that was inputted into form, checks for a return from the API, stores it to local memory, and updates history
function cityInput(event){
    event.preventDefault();
    var city = $("#cityInput")[0].value;
    var cityObject = getCity(city);
}

// local storage city check and display
function localCities() {
    if (localStorage.getItem("cities") === null){
        return;
    } else {
        var storedCities = JSON.parse(localStorage.getItem("cities"));
        $("#history").empty();
        for (i = 0; i <storedCities.length; i++){
            $("#history").append(`<button class="btn btn-primary" type="button">` + storedCities[i] + `</button>`)
        }
    }
}

// api call for city weather data
function getCity(city) {
    var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=90e1750460ce4e52ef6971110d7e95e1&limit=1&units=imperial'
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (localStorage.getItem("cities") === null){
                    var storedCities = [];
                    storedCities[0] = city;
                    localStorage.setItem("cities", JSON.stringify(storedCities));
                } else {
                    var storedCities = JSON.parse(localStorage.getItem("cities"));
                    storedCities.unshift(city);
                    for (i=1;i<storedCities.length;i++) {
                        if (city === storedCities[i]){
                            storedCities.splice(i,1);
                        }
                    }
                    localStorage.setItem("cities", JSON.stringify(storedCities));
                }
                localCities();
                weatherUpdate(data.city.coord.lat , data.city.coord.lon, data.city.name);
        });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function (error) {
        alert('Unable to connect to OpenWeatherMap');
    });
};

function weatherUpdate(lat , lon , city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=` + lat + `&lon=` + lon + `&exclude=hourly,minutely&appid=90e1750460ce4e52ef6971110d7e95e1&units=imperial`;
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                debugger;
                $("#cityName").empty();
                $("#cityName").append(city);
                var today = new Date();
                $("#currentDate").empty();
                $("#currentDate").append("Current Date: " + today.toLocaleDateString());
                $("#cityName").append(`<img src="http://openweathermap.org/img/wn/` + data.current.weather[0].icon + `@2x.png" alt="current weather image">`)
                $("#temp").empty();
                $("#temp").append(`Temperature: ` + data.current.temp + `°F`)
                $("#humidity").empty();
                $("#humidity").append(`Humidity: ` + data.current.humidity +`%`);
                $("#windSpeed").empty();
                $("#windSpeed").append(`Wind speed: ` + data.current.wind_speed +`mph`);
                $("#uvIndex").empty();
                $("#uvIndex").append(`UV Index: ` + data.current.uvi)
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function (error) {
        alert('Unable to connect to OpenWeatherMap');
    });
};

$("#clearButton").on("click" , function () {
    $("#history").empty();
    localStorage.removeItem("cities");
})



// date help https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript