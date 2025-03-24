// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const voiceSearchButton = document.getElementById('voice-search-button');
const lensScanButton = document.getElementById('lens-scan-button');
const resultsGrid = document.getElementById('results-grid');
const recipeGrid = document.getElementById('recipe-grid');
const totalCalories = document.getElementById('total-calories');
const totalProtein = document.getElementById('total-protein');
const totalCarbs = document.getElementById('total-carbs');
const totalFats = document.getElementById('total-fats');
const calorieProgress = document.getElementById('calorie-progress');
const darkModeButton = document.getElementById('dark-mode-button');
const foodCategories = document.querySelectorAll('.category-card');

// API Keys and URLs (Replace with your actual keys)
const API_KEY = 'AIzaSyB_GNWexKik0CAowp-LvzDDTsOYsx4yYbE';

const geminiApiKey = 'AIzaSyB_GNWexKik0CAowp-LvzDDTsOYsx4yYbE';
const url = 'https://api.gemini.com/v1/endpoint'; // Replace with the actual Gemini API endpoint

// Speech Recognition
const voiceSearch = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new voiceSearch();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Event Listeners
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    search(query);
});

voiceSearchButton.addEventListener('click', () => {
    recognition.start();
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    search(transcript);
};

recognition.onerror = (event) => {
    console.error(event.error);
};

// Dark Mode Toggle
darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeButton.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Search Function
async function search(query) {
    if (!query) return;

    // Fetch nutrition data
    const nutritionData = await fetchNutritionData(query);
    if (nutritionData) {
        displayNutritionData(nutritionData);
    }

    // Fetch recipe suggestions
    const recipes = await fetchRecipes(query);
    if (recipes) {
        displayRecipes(recipes);
    }
}

// Fetch Nutrition Data
async function fetchNutritionData(query) {
    try {
        const response = await fetch(NUTRITIONIX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': NUTRITIONIX_APP_ID,
                'x-app-key': NUTRITIONIX_APP_KEY,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        return data.foods ? data.foods[0] : null;
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        return null;
    }
}

// Display Nutrition Data
function displayNutritionData(data) {
    totalCalories.textContent = `${data.nf_calories} kcal`;
    totalProtein.textContent = `${data.nf_protein}g`;
    totalCarbs.textContent = `${data.nf_total_carbohydrate}g`;
    totalFats.textContent = `${data.nf_total_fat}g`;

    // Update progress bar (example: calorie progress)
    const calorieGoal = 2000; // Example daily calorie goal
    const progress = (data.nf_calories / calorieGoal) * 100;
    calorieProgress.style.width = `${progress}%`;
}

// Fetch Recipes
async function fetchRecipes(query) {
    try {
        const response = await fetch(`${SPOONACULAR_API_URL}?query=${query}&apiKey=${SPOONACULAR_API_KEY}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return null;
    }
}

// Display Recipes
function displayRecipes(recipes) {
    recipeGrid.innerHTML = recipes
        .map(
            (recipe) => `
        <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        </div>
    `
        )
        .join('');
}

// Camera/Lens Scan Functionality
lensScanButton.addEventListener('click', async () => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const resultDiv = document.createElement('div');

    document.body.appendChild(video);
    document.body.appendChild(canvas);
    canvas.style.display = 'none';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.autoplay = true;

        const captureButton = document.createElement('button');
        captureButton.innerHTML = '<i class="fas fa-camera"></i> Capture Image';
        document.body.appendChild(captureButton);

        captureButton.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/png');
            resultDiv.innerHTML = `<img src="${imageData}" alt="Captured Image" style="max-width: 100%; border-radius: 10px;">`;
            document.body.appendChild(resultDiv);

            // Send the image for identification (optional)
            identifyItem(imageData);
        });
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
});

// Function to identify item from image (optional)
async function identifyItem(imageData) {
    try {
        const response = await fetch('/identify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        });

        const data = await response.json();
        console.log('Identified Item:', data.item);
    } catch (error) {
        console.error('Error identifying item:', error);
    }
}