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
        .then(async (data) => {
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

                    await new Promise(res => {
                        setTimeout(() => {
                            divs[i].innerText = `${data.hourly.temperature_2m[index + i + 1]}°C`;
                            divs2[i].innerText = data.hourly.time[index + i + 1].slice(-5);
                            res();
                        }, Math.random() *1000);
                    })
                }

            }
            else {
                let i = 0;
                await new Promise(res => {
                    const intervalId = setInterval(() => {
                        if (i >= divs.length-1) {
                            clearInterval(intervalId);
                            res();
                        }
                        divs[i].innerText = `${data.hourly.temperature_2m[index + i + 1]}F`;
                        divs2[i].innerText = data.hourly.time[index + i + 1].slice(-5);
                        i++;
                    }, Math.random() *1000);
                });
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
    localStorage.setItem('city', city);
    if (regex.test(city))
        updateDegreeType(city);
    else
        alert("city name not valid");
}

async function updateDegreeType(city) {
    let selectElement = document.getElementById("degreeSelect");
    let degreeType = selectElement.value;
    localStorage.setItem('degree', degreeType);
    await getTemperature(city, degreeType);
    changeEmoji(degreeType);

}
async function changeEmoji(degree) {
    const divs = document.getElementsByClassName('card');

    for (let i = 0; i < divs.length; i++) {
        if (degree === 'celsius') {
            if (divs[i].getElementsByClassName('temp2')[0].innerText > '15') {
                divs[i].classList.remove('ice');
                divs[i].classList.add('hot');
            }
            else {
                divs[i].classList.remove('hot');
                divs[i].classList.add('ice');
            }
        }
        else {
            if (divs[i].getElementsByClassName('temp2')[0].innerText > '59') {
                divs[i].classList.remove('ice');
                divs[i].classList.add('hot');
            }
            else {
                divs[i].classList.remove('hot');
                divs[i].classList.add('ice');
            }
        }
    }
}
window.addEventListener('load', () => {
    document.querySelector('select').value = localStorage.getItem('degree');
    document.querySelector('input').value = localStorage.getItem('city');
    document.getElementById('card_delete').addEventListener('click', () => {
        const cards = document.getElementsByClassName('card');
        const column = document.getElementsByClassName('column');
        column[0].removeChild(cards[cards.length - 1]);
    });
    document.getElementById('dark').addEventListener('click', () => {
        document.body.style.backgroundColor = 'black';
        document.querySelectorAll('.card').forEach(div => {
        div.style.backgroundColor = 'grey';
        });
        document.querySelector('select').style.backgroundColor = 'grey';
        document.querySelector('input').style.backgroundColor = 'grey';
        document.querySelectorAll('a').forEach(a=>{
            a.style.backgroundColor = 'grey';
        });
   
    });
    document.getElementById('light').addEventListener('click', () => {
        document.body.style.backgroundColor =  '#6faef1';
        document.querySelectorAll('.card').forEach(div => {
        div.style.backgroundColor = 'white';
        });
        document.querySelector('select').style.backgroundColor = 'white';
        document.querySelector('input').style.backgroundColor = 'white';
        document.querySelectorAll('a').forEach(a=>{
            a.style.backgroundColor = 'white';
        });
    });
    document.getElementById('add_cards').addEventListener('click',()=>{
        const rand=(Math.random()*100)%10;
        const column= document.getElementsByClassName('column');
       
        for(let i=0;i<rand;i++){
        const div=document.createElement('div');
        div.classList.add('card');
        div.classList.add('ice');
        div.innerHTML=`<div class="time"></div>
        <div class="temp2"></div>`;
        column[0].appendChild(div);}});
});
