const apiUrl = "https://api.open-meteo.com/v1/forecast";
const geoApi = 'https://nominatim.openstreetmap.org/search';
const regex = /^[a-zA-Z]+$/;

async function getTemperature(city, tUnit) {
    let lat = 0;
    let lon = 0;
    await fetch(`${geoApi}?q=${city}&format=json`)
        .then(res => res.json()).then(data => {
            lat = data[0].lat
            lon = data[0].lon;
        })
    await fetch(`${apiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${tUnit}&timezone=auto&hourly=temperature_2m&`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const temperatureDiv = document.getElementById("temp");
            const temperatureData = data.current_weather.temperature;
            if (tUnit === 'celsius')
                temperatureDiv.innerText = `${temperatureData}°C`;
            else
                temperatureDiv.innerText = `${temperatureData}F`;

            const index = data.hourly.time.indexOf(data.current_weather.time);
            const divs = document.getElementsByClassName('temp2');
            const divs2 = document.getElementsByClassName('time');
            if (tUnit === 'celsius') {
                for (let i = 0; i < divs.length; i++) {
                    divs[i].innerText = `${data.hourly.temperature_2m[index + i + 1]}°C`;
                    divs2[i].innerText = data.hourly.time[index + i + 1].slice(-5);
                }
            }
            else {
                for (let i = 0; i < divs.length; i++) {
                    divs[i].innerText = `${data.hourly.temperature_2m[index + i + 1]}F`;
                    divs2[i].innerText = data.hourly.time[index + i + 1].slice(-5);
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function submitCity() {
    event.preventDefault();
    let inputElement = document.getElementById("city-name");
    let city = inputElement.value;
    if(regex.test(city))
    updateDegreeType(city);
    else
        alert("city name not valid");
}

async function updateDegreeType(city) {
    let selectElement = document.getElementById("degreeSelect");
    let degreeType = selectElement.value;
    await getTemperature(city, degreeType);
    changeEmoji();

}
async function changeEmoji() {
    const divs = document.getElementsByClassName('card');
    for (let i = 0; i < divs.length; i++) {  
        if (divs[i].getElementsByClassName('temp2')[0].innerText > '15') {
            divs[i].classList.remove('ice');
            divs[i].classList.add('hot');
        }
        else {
            divs[i].classList.remove('hot');
            divs[i].classList.add('ice');
        }
    }

}