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
    var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=90e1750460ce4e52ef6971110d7e95e1&limit=1'
    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            workWithData(data, city);
        });
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function (error) {
        alert('Unable to connect to OpenWeatherMap');
    });
};

function workWithData(cityData, city) {
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
    localCities()
}