// document.addEventListener('DOMContentLoaded', () => {
//     const searchLocationBtn = document.getElementById('search-location');
//     const locationInput = document.getElementById('location');
//     const locationResults = document.getElementById('location-results');
//     const panchangForm = document.getElementById('panchang-form');
//     const panchangOutput = document.getElementById('panchang-output');

//     // Search Location
//     searchLocationBtn.addEventListener('click', async () => {
//         const searchQuery = locationInput.value.trim();
//         if (!searchQuery) return;

//         try {
//             const response = await fetch(`/api/search-location?search=${encodeURIComponent(searchQuery)}`);
//             const data = await response.json();
//             displayLocationResults(data);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     });

//     // Display Location Results
//     function displayLocationResults(data) {
//         locationResults.innerHTML = '';
//         data.forEach(item => {
//             const div = document.createElement('div');
//             div.textContent = `${item.name}, ${item.country}`;
//             div.classList.add('location-item');
//             div.addEventListener('click', () => {
//                 locationInput.value = item.name;
//                 document.getElementById('geonameId').value = item.geonameId;
//                 locationResults.innerHTML = '';
//             });
//             locationResults.appendChild(div);
//         });
//     }

//     // Fetch Panchang Data
//     panchangForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const date = document.getElementById('date').value;
//         const geonameId = document.getElementById('geonameId').value;
//         const lang = document.getElementById('language').value;

//         try {
//             const response = await fetch(`/api/panchang?date=${date}&geonameId=${geonameId}&lang=${lang}`);
//             const data = await response.json();
//             localStorage.setItem('panchangData', JSON.stringify(data));
//             localStorage.setItem('boxData', JSON.stringify({
//                 date: new Date(date).toLocaleDateString('en-GB'),
//                 day: new Date(date).toLocaleDateString('en-GB', { weekday: 'long' }),
//                 vikramSamvat: '2080',
//                 tithi: data['Tithi'],
//                 mash: data['Masa']
//             }));
//             window.location.href = '/panchang-results.html';
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     });
// });




document.getElementById('search-location').addEventListener('click', async function () {
    const location = document.getElementById('location').value;

    if (!location) {
        alert('Please enter a location');
        return;
    }

    try {
        const response = await fetch(`/api/search-location?search=${encodeURIComponent(location)}`);
        if (!response.ok) throw new Error('Failed to search location.');

        const data = await response.json();
        displayLocationResults(data.geonames);
    } catch (error) {
        console.error('Error searching location:', error);
        document.getElementById('location-results').innerHTML = 'Error searching location. Please try again.';
    }
});

function displayLocationResults(locations) {
    const resultsDiv = document.getElementById('location-results');
    resultsDiv.innerHTML = '';

    if (locations.length === 0) {
        resultsDiv.innerHTML = 'No locations found.';
        return;
    }

    const ul = document.createElement('ul');
    locations.forEach(location => {
        const li = document.createElement('li');
        li.textContent = `${location.city}, ${location.state}, ${location.country}`;
        li.addEventListener('click', () => {
            document.getElementById('location').value = `${location.city}, ${location.state}, ${location.country}`;
            document.getElementById('geonameId').value = location.id;
            resultsDiv.innerHTML = '';
        });
        ul.appendChild(li);
    });

    resultsDiv.appendChild(ul);
}

document.getElementById('panchang-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const geonameId = document.getElementById('geonameId').value;
    const language = document.getElementById('language').value;

    if (!date || !geonameId) {
        alert('Please select a location and date');
        return;
    }

    try {
        const response = await fetch(`/api/panchang?date=${date}&geonameId=${geonameId}&lang=${language}`);
        if (!response.ok) throw new Error('Failed to fetch Panchang data.');

        const data = await response.json();

        // Extract important details for the decorative box
        const boxData = {
            date,
            day: new Date(date).toLocaleDateString('hi-IN', { weekday: 'long' }),
            vikramSamvat: data['विक्रम सम्वतबृहस्पति सम्वत्सर'],
            hindiMonth: data['हिन्दी महिना'],
            tithi: data['तिथिनक्षत्र'],
            nakshatra: data['नक्षत्र'],
            mash: data['प्रविष्टे/गते']
        };

        // Store Panchang data and box data in localStorage
        localStorage.setItem('panchangData', JSON.stringify(data));
        localStorage.setItem('boxData', JSON.stringify(boxData));

        // Redirect to a new page to display the Panchang data
        window.open('/panchang-results.html', '_blank');
    } catch (error) {
        console.error('Error fetching Panchang:', error);
        document.getElementById('panchang-output').innerHTML = 'Error fetching Panchang data. Please try again.';
    }
});


