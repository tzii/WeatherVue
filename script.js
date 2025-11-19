// --- CONSTANTS ---
const CITIES = {
    rome: { latitude: 41.9028, longitude: 12.4964 },
    paris: { latitude: 48.8566, longitude: 2.3522 },
    london: { latitude: 51.5074, longitude: -0.1278 },
    "new-york": { latitude: 40.7128, longitude: -74.0060 },
    "los-angeles": { latitude: 34.0522, longitude: -118.2437 },
};

const WEATHER_PARAMS = {
    temperature_2m: "Temperature", relative_humidity_2m: "Humidity",
    apparent_temperature: "Feels Like", is_day: "Day/Night",
    precipitation: "Precipitation", rain: "Rain",
    wind_speed_10m: "Wind Speed", wind_direction_10m: "Wind Dir",
    weather_code: "Conditions", cloud_cover: "Cloud Cover",
    pressure_msl: "Pressure", snowfall: "Snowfall"
};

const WMO_CODES = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Rime Fog", 51: "Light Drizzle", 53: "Drizzle",
    55: "Heavy Drizzle", 56: "Freezing Drizzle", 57: "Heavy Freezing Drizzle",
    61: "Slight Rain", 63: "Rain", 65: "Heavy Rain", 66: "Freezing Rain",
    67: "Heavy Freezing Rain", 71: "Slight Snow", 73: "Snow", 75: "Heavy Snow",
    77: "Snow Grains", 80: "Slight Showers", 81: "Showers", 82: "Heavy Showers",
    85: "Snow Showers", 86: "Heavy Snow Showers", 95: "Thunderstorm",
    96: "Thunderstorm & Hail", 99: "Heavy Thunderstorm & Hail"
};

const LANGUAGES = {
    en: "English", de: "German", fr: "French", es: "Spanish", it: "Italian",
    pt: "Portuguese", ru: "Russian", ja: "Japanese", zh: "Chinese", ar: "Arabic",
};

// --- DOM ELEMENTS ---
const citySelect = document.getElementById("city-select");
const weatherParamsContainer = document.getElementById("weather-params");
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherResultsContainer = document.getElementById("weather-results");
const translateBtn = document.getElementById("translate-btn");
const translationContainer = document.getElementById("translation-container");
const translationResultWrapper = document.getElementById("translation-result-wrapper");
const translationResult = document.getElementById("translation-result");
const clearBtn = document.getElementById("clear-btn");
const selectAllBtn = document.getElementById("select-all-btn");
const themeDot = document.getElementById("theme-dot");

const splashScreen = document.getElementById("splash-screen");
const settingsDrawer = document.getElementById("settings-drawer");
const settingsToggle = document.getElementById("settings-toggle");
const closeDrawerBtn = document.getElementById("close-drawer");

const languageTrigger = document.getElementById('language-trigger');
const languageDropdown = document.getElementById('language-dropdown');
const currentLanguageLabel = document.getElementById('current-language-label');
const languageValueInput = document.getElementById('language-value');
const langArrow = document.getElementById('lang-arrow');

// --- THEME LOGIC ---

let currentTheme = localStorage.getItem('wv-theme') || 'system';

function initTheme() {
    const themeBtns = document.querySelectorAll('[data-set-theme]');

    function applyTheme(theme) {
        currentTheme = theme;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            // System
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }

        // Update buttons in drawer
        themeBtns.forEach(btn => {
            if (btn.dataset.setTheme === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Save
        localStorage.setItem('wv-theme', theme);
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.dataset.setTheme));
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('wv-theme') === 'system') {
            applyTheme('system');
        }
    });

    applyTheme(currentTheme);
}

// NEW: Cycle theme via Dot
themeDot.addEventListener('click', () => {
    // Cycle Order: light -> dark -> system
    if(currentTheme === 'light') {
        document.querySelector('[data-set-theme="dark"]').click();
    } else if(currentTheme === 'dark') {
        document.querySelector('[data-set-theme="system"]').click();
    } else {
        document.querySelector('[data-set-theme="light"]').click();
    }
});

// --- INITIALIZATION ---

function hideSplash() {
    splashScreen.style.opacity = '0';
    splashScreen.style.pointerEvents = 'none';
    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    populateWeatherParams();
    populateLanguages();
    setTimeout(hideSplash, 1200);
});

window.addEventListener('load', hideSplash);

// --- LANGUAGE DROPDOWN ---

function populateLanguages() {
    languageDropdown.innerHTML = '';
    for (const langCode in LANGUAGES) {
        const item = document.createElement("div");
        item.className = "lang-item px-4 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors";
        item.textContent = LANGUAGES[langCode];
        item.addEventListener('click', () => {
            languageValueInput.value = langCode;
            currentLanguageLabel.textContent = LANGUAGES[langCode];
            toggleLanguageDropdown(false);
        });
        languageDropdown.appendChild(item);
    }
}

function toggleLanguageDropdown(forceState) {
    const isClosed = languageDropdown.classList.contains('hidden');
    const shouldOpen = forceState !== undefined ? forceState : isClosed;

    if (shouldOpen) {
        languageDropdown.classList.remove('hidden');
        setTimeout(() => {
            languageDropdown.classList.remove('opacity-0', '-translate-y-2');
            langArrow.classList.add('rotate-180');
        }, 10);
    } else {
        languageDropdown.classList.add('opacity-0', '-translate-y-2');
        langArrow.classList.remove('rotate-180');
        setTimeout(() => {
            languageDropdown.classList.add('hidden');
        }, 200);
    }
}

languageTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLanguageDropdown();
});

document.addEventListener('click', (e) => {
    if (!languageTrigger.contains(e.target) && !languageDropdown.contains(e.target)) {
        toggleLanguageDropdown(false);
    }
});

// --- SETTINGS ---

let allSelected = false;
selectAllBtn.addEventListener('click', () => {
    const checkboxes = weatherParamsContainer.querySelectorAll('input[type="checkbox"]');
    const labels = weatherParamsContainer.querySelectorAll('label');
    allSelected = !allSelected;
    checkboxes.forEach(cb => cb.checked = allSelected);
    labels.forEach(lbl => {
        if(allSelected) lbl.classList.add('active');
        else lbl.classList.remove('active');
    });
    selectAllBtn.textContent = allSelected ? "Deselect All" : "Select All";
});

function populateWeatherParams() {
    weatherParamsContainer.innerHTML = ""; 
    for (const param in WEATHER_PARAMS) {
        const label = document.createElement("label");
        label.className = "checkbox-ticket"; 
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = param;
        
        if(['temperature_2m', 'weather_code'].includes(param)) {
            checkbox.checked = true;
            label.classList.add('active');
        }

        checkbox.addEventListener('change', (e) => {
            if(e.target.checked) label.classList.add('active');
            else label.classList.remove('active');
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(WEATHER_PARAMS[param]));
        weatherParamsContainer.appendChild(label);
    }
}

// --- API & UI ---

function toggleDrawer(show) {
    if(show) settingsDrawer.classList.remove('translate-x-full');
    else settingsDrawer.classList.add('translate-x-full');
}

settingsToggle.addEventListener('click', () => toggleDrawer(true));
closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));

async function getWeatherData() {
    const selectedCity = citySelect.value;
    const { latitude, longitude } = CITIES[selectedCity];
    const selectedParams = Array.from(weatherParamsContainer.querySelectorAll("input:checked")).map(cb => cb.value);

    if (selectedParams.length === 0) {
        alert("Please select at least one metric.");
        return;
    }

    toggleDrawer(false); 

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${selectedParams.join(",")}`;

    try {
        weatherResultsContainer.innerHTML = `<div class="col-span-full text-center pt-20" style="color: var(--text-muted)"><h2 class="text-xl font-serif animate-pulse">Acquiring Satellite Feed...</h2></div>`;
        translationContainer.classList.add('hidden');
        clearBtn.style.opacity = '0';
        clearBtn.style.pointerEvents = 'none';

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) throw new Error(data.reason);

        displayWeatherData(data.current, data.current_units, selectedParams);
        
        translationContainer.classList.remove('hidden');
        setTimeout(() => translationContainer.style.opacity = '1', 100);
        clearBtn.style.opacity = '1';
        clearBtn.style.pointerEvents = 'auto';

    } catch (error) {
        weatherResultsContainer.innerHTML = `<div class="col-span-full text-red-600 text-center font-bold">Error: ${error.message}</div>`;
    }
}

async function translateWeather() {
    if (!AZURE_API_KEY) {
        alert("Azure API Key is missing.");
        return;
    }

    const targetLanguage = languageValueInput.value;
    const weatherText = buildWeatherSummary();
    
    if (!weatherText) return;

    translateBtn.textContent = "Translating...";
    translateBtn.disabled = true;
    
    const apiUrl = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
                'Ocp-Apim-Subscription-Region': 'italynorth',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{ text: weatherText }]),
        });

        if (!response.ok) throw new Error(response.statusText);

        const translation = await response.json();
        displayTranslation(translation[0].translations[0].text, targetLanguage);
    } catch (error) {
        console.error(error);
        alert("Translation failed.");
    } finally {
        translateBtn.textContent = "Translate";
        translateBtn.disabled = false;
    }
}

function displayWeatherData(currentData, units, params) {
    weatherResultsContainer.innerHTML = ""; 

    const ICONS = {
        temperature_2m: "fa-solid fa-thermometer-half", relative_humidity_2m: "fa-solid fa-tint",
        apparent_temperature: "fa-solid fa-user-circle", is_day: "fa-solid fa-sun",
        precipitation: "fa-solid fa-cloud-showers-heavy", rain: "fa-solid fa-cloud-rain",
        wind_speed_10m: "fa-solid fa-wind", wind_direction_10m: "fa-solid fa-compass",
        weather_code: "fa-solid fa-cloud-sun", cloud_cover: "fa-solid fa-cloud",
        pressure_msl: "fa-solid fa-arrow-down", snowfall: "fa-solid fa-snowflake"
    };

    const titleRow = document.createElement('div');
    titleRow.className = "col-span-full mb-12 text-center animate-fade-in-up";
    titleRow.innerHTML = `
        <p class="text-red-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Live Data Feed</p>
        <h2 class="text-6xl md:text-8xl font-serif font-bold" style="color: var(--text-main)">${citySelect.options[citySelect.selectedIndex].text}</h2>
    `;
    weatherResultsContainer.appendChild(titleRow);

    params.forEach((param, index) => {
        if (currentData[param] === undefined) return;
        
        let rawValue = currentData[param];
        let unit = units[param] || "";
        let displayValue = rawValue;
        let iconName = ICONS[param] || 'circle';
        let cardClass = "weather-card"; 

        if (param === 'is_day') {
            displayValue = rawValue === 1 ? "Day" : "Night";
            unit = ""; 
            iconName = rawValue === 1 ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
        if (param === 'weather_code') {
            displayValue = WMO_CODES[rawValue] || "Unknown";
            unit = "";
            if (rawValue === 0) iconName = "fa-solid fa-sun";
            else if (rawValue > 0 && rawValue < 40) iconName = "fa-solid fa-cloud";
            else if (rawValue >= 50) iconName = "fa-solid fa-cloud-rain";
            if(displayValue.length > 10) cardClass += " text-long"; 
        }

        const delay = index * 100; 
        const card = document.createElement("div");
        card.className = cardClass;
        card.innerHTML = `
            <div class="content">
                <h4>${WEATHER_PARAMS[param]}</h4>
                <div class="value ${typeof displayValue === 'string' ? 'text-3xl' : ''}">${displayValue}<span class="unit">${unit}</span></div>
            </div>
            <i class="${iconName} watermark-icon"></i>
        `;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
        weatherResultsContainer.appendChild(card);
    });
}

function buildWeatherSummary() {
    const results = weatherResultsContainer.querySelectorAll('.weather-card');
    if (results.length === 0) return "";
    let summary = `Weather report for ${citySelect.options[citySelect.selectedIndex].text}: `;
    results.forEach(item => {
        const label = item.querySelector('h4').textContent;
        const value = item.querySelector('.value').textContent;
        summary += `${label} is ${value.replace(/\s+/g, ' ').trim()}; `;
    });
    return summary;
}

function displayTranslation(text, langCode) {
    translationResultWrapper.classList.remove('hidden');
    translationResult.textContent = `"${text}"`;
}

getWeatherBtn.addEventListener("click", getWeatherData);
translateBtn.addEventListener("click", translateWeather);
clearBtn.addEventListener("click", () => location.reload());