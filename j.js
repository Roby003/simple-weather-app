const apiUrl = "https://api.open-meteo.com/v1/forecast";
const geoApi = 'https://nominatim.openstreetmap.org/search';


async function getTemperature(city, tUnit) {
    let lat = 0;
    let lon = 0;
    await fetch(`${geoApi}?q=${city}&format=json`)
        .then(res => res.json()).then(data => {
            lat = data[0].lat
            lon = data[0].lon;
        })
    fetch(`${apiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${tUnit}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const temperatureDiv = document.getElementById("temp");
            const temperatureData = data.current_weather.temperature;
           console.log(tUnit);
            if (tUnit === 'celsius')
                temperatureDiv.innerText = `${temperatureData}°C`;
            else
                temperatureDiv.innerText = `${temperatureData}F`;
        })
        .catch(error => {
            console.error(error);
        });
}

function submitCity() {
    event.preventDefault();
    let inputElement = document.getElementById("city-name");
    let city = inputElement.value;
    updateDegreeType(city);

}
function updateDegreeType(city) {
    var selectElement = document.getElementById("degreeSelect");


    var degreeType = selectElement.value;

    getTemperature(city, degreeType);

}



