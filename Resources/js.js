
// Listening event for city submit button
$("#citySubmit").on("click", cityInput);
// Takes city that was inputted into form, checks for a return from the API, stores it to local memory, and updates history
function cityInput(event){
    event.preventDefault();
    var city = $("#cityInput")[0].value;
    var cityObject = getCity(city);
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
        alert('Unable to connect to GitHub');
    });
};

function workWithData(cityData, city) {
    
}