# WeatherVue

WeatherVue is a sleek, modern web application that allows users to fetch and visualize real-time weather data from around the world. It features a clean, minimalist design with dynamic themes and provides on-the-fly translation of weather summaries into multiple languages using the Azure Translator service.

 

## Features

- **Dynamic Theming**: Switch between light, dark, and system-default themes.
- **City Selection**: Choose from a curated list of major cities.
- **Customizable Metrics**: Select from a wide range of weather parameters to display.
- **Real-Time Data**: Fetches current weather information from the Open-Meteo API.
- **Instant Translation**: Translates weather summaries into over 10 languages via Azure AI.
- **Responsive Design**: A fully responsive interface that looks great on any device.

## Project Structure

- `index.html`: The main HTML file containing the application's structure.
- `style.css`: The stylesheet, featuring Tailwind CSS and custom properties for theming.
- `script.js`: The core JavaScript file handling all application logic, API calls, and UI updates.
- `api-config.js`: The configuration file for your Azure Translator API key. **This file is excluded from version control.**
- `api-config.example.js`: An example configuration file.
- `.gitignore`: Ensures that `api-config.js` is not committed to your repository.
- `README.md`: This file.

## Getting Started

To run this project locally, you will need to provide your own Azure AI Translator API key.

### 1. Get an Azure AI Translator API Key

If you don't already have one, you will need to create a Translator resource in the Azure portal. Follow the official Microsoft documentation to obtain your key and region: [Create a Translator resource](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-how-to-signup).

### 2. Configure Your API Key

1.  In the project's root directory, rename `api-config.example.js` to `api-config.js`.
2.  Open the new `api-config.js` file. You will see the following line:
    ```javascript
    const AZURE_API_KEY = "YOUR_AZURE_API_KEY";
    ```
3.  Replace `"YOUR_AZURE_API_KEY"` with your actual Azure Translator API key.
4.  **Important**: In `script.js`, you may need to update the Azure region. Find the `translateWeather` function and modify the `Ocp-Apim-Subscription-Region` to match your resource's region if it is not `italynorth`.

### 3. Run the Application

Simply open the `index.html` file in your web browser to start using WeatherVue.

## How to Use

1.  **Configure Settings**: Click the menu icon in the top-right corner to open the settings drawer.
2.  **Choose a Theme**: Select your preferred appearance (Light, Dark, or System).
3.  **Select a City**: Pick a city from the dropdown menu.
4.  **Select Metrics**: Check the boxes for the weather data you wish to view.
5.  **Reveal Data**: Click the "Reveal Data" button to fetch and display the weather cards.
6.  **Translate**: Once the data is loaded, select a target language and click "Translate" to view the translated summary.
7.  **Clear**: Click the refresh button to reset the application.
