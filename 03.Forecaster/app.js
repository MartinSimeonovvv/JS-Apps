import { html, render } from 'https://unpkg.com/lit-html?module';

const symbols = {
    'Sunny': '☀',
    'Partly sunny': '⛅',
    'Overcast': '☁',
    'Rain': '☂',
    'Degrees': '°'
}

document.getElementById('submit').addEventListener('click', getWeather)

async function getWeather() {
    const url = `http://localhost:3030/jsonstore/forecaster/locations`
    const response = await fetch(url)
    const data = await response.json()
    window.getWeather = getWeather

    const input = document.getElementById('location').value
    const code = data.find(x => x.name.toLowerCase() == input.toLowerCase()).code

    await forcasterToday(code)
    await forcasterUpcoming(code)
    document.getElementById('forecast').style.display = 'block'
}

async function forcasterToday(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/today/` + code
    const response = await fetch(url)
    const data = await response.json()

    const htmlResult = html`
                <div class="label">Current conditions</div>
                <div class="forecasts">
                    <span class="condition symbol">${symbols[data.forecast.condition]}</span>
                    <span class="condition">
                        <span class="forecast-data">${data.name}</span>
                        <span class="forecast-data">${data.forecast.low}/${data.forecast.high}</span>
                        <span class="forecast-data">${data.forecast.condition}</span>
                    </span>
                </div>`

    const current = document.getElementById('current')
    render(htmlResult, current)
}

async function forcasterUpcoming(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/upcoming/` + code
    const response = await fetch(url)
    const data = await response.json()

    const htmlResult = html`
                <div class="label">Three-day forecast</div>
                <div class="forecast-info">
                    ${data.forecast.map(forecast => html`
                    <span class="upcoming">
                        <span class="symbol">${symbols[forecast.condition]}</span>
                        <span class="forecast-data">${forecast.low}/${forecast.high}</span>
                        <span class="forecast-data">${forecast.condition}</span>`)}
                    </span>
                </div>
    `;

    const upcoming = document.getElementById('upcoming')
    render(htmlResult, upcoming)
}