localCities();
// Listening event for city submit button
$("#citySubmit").on("click", cityInput);
// Takes city that was inputted into form, checks for a return from the API, stores it to local memory, and updates history
function cityInput(event){
    event.preventDefault();
    var city = $("#cityInput")[0].value;
    getCity(city);
}

// local storage city check and display
function localCities() {
    if (localStorage.getItem("cities") === null){
        return;
    } else {
        var storedCities = JSON.parse(localStorage.getItem("cities"));
        $("#history").empty();
        for (i = 0; i <storedCities.length; i++){
            $("#history").append(`<button onclick="cityHistory('` + storedCities[i] + `')" class="btn btn-primary" type="button">` + storedCities[i] + `</button>`)
        }
    }
}
function cityHistory(city){
    $("#cityInput")[0].value = city;
    cityInput(event);
}

// api call for city weather data
function getCity(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=90e1750460ce4e52ef6971110d7e95e1&limit=1&units=imperial'
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
// updates current conditions, calls functiont o update future conditions
function weatherUpdate(lat , lon , city){
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=` + lat + `&lon=` + lon + `&exclude=hourly,minutely&appid=90e1750460ce4e52ef6971110d7e95e1&units=imperial`;
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                $("#cityName").empty();
                $("#cityName").append(city);
                var today = new Date();
                $("#currentDate").empty();
                $("#currentDate").append("Current Date: " + today.toLocaleDateString());
                $("#cityName").append(`<img src="https://openweathermap.org/img/wn/` + data.current.weather[0].icon + `@2x.png" alt="current weather image">`)
                $("#temp").empty();
                $("#temp").append(`Temperature: ` + data.current.temp + `°F`)
                $("#humidity").empty();
                $("#humidity").append(`Humidity: ` + data.current.humidity +`%`);
                $("#windSpeed").empty();
                $("#windSpeed").append(`Wind speed: ` + data.current.wind_speed +`mph`);
                $("#uvIndex").empty();
                $("#uvIndex").append(`UV Index: <div class="row card col-xl-1 col-md-1 col-xs-2" id="uvColor">` + data.current.uvi + `</div>`)
                uvColorChange();
                futureConditions(data);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function (error) {
        alert('Unable to connect to OpenWeatherMap');
    });
};
// varies opacity of uv background
function uvColorChange(){
var uv =$("#uvColor")[0].textContent;
var opacity = parseFloat(uv);
opacity = (opacity/10);
$("#uvColor").css("color","black");
$("#uvColor").css("background-color","rgba(255,0,0," + opacity + ")");
}
// updates future conditions
function futureConditions(data){
    var today = new Date();
    for(i=0;i<5;i++){
        today.setDate(today.getDate()+1);
        $("#card" + i).empty();
        $("#card" + i).append(`<p>` + today.toLocaleDateString() +`</p>`)
        $("#card" + i).append(`<img src="https://openweathermap.org/img/wn/` + data.daily[i].weather[0].icon + `@2x.png" alt="future weather image">`);
        $("#card" + i).append(`<p>Temperature: ` + data.daily[i].temp.day+ `°F</p>`);
        $("#card" + i).append(`<p>Humidity: `+ data.daily[i].humidity +`%</p>`);
    }
}
$("#clearButton").on("click" , function () {
    $("#history").empty();
    localStorage.removeItem("cities");
})



// date help https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript