const geminiApiKey = 'AIzaSyB_GNWexKik0CAowp-LvzDDTsOYsx4yYbE';
const url = 'https://api.gemini.com/v1/endpoint'; // Replace with the actual Gemini API endpoint
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${geminiApiKey}`,
  },
};

fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  fetch()