const API_KEY = 'a7451675d8edd780db260d2151f35c98';
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch and display popular movies
function fetchPopularMovies() {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
    $.getJSON(url, function (data) {
        displayMovies(data.results, '#popular-grid');
    });
}

// Search movies
function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
    $.getJSON(url, function (data) {
        displayMovies(data.results, '#search-grid');
    });
}

// Display movies in a grid
function displayMovies(movies, gridSelector) {
    const grid = $(gridSelector);
    grid.empty(); // Clear existing content
    movies.forEach(movie => {
        const card = `
            <div class="card">
                <h3>${movie.title}</h3>
                <p>Release Year: ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                <button onclick="fetchMovieDetails(${movie.id})">Details</button>
            </div>
        `;
        grid.append(card);
    });
}

// Fetch and display movie details in a modal
function fetchMovieDetails(movieId) {
    const movieUrl = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const creditsUrl = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;

    // Fetch movie details
    $.getJSON(movieUrl, function (movieData) {
        $.getJSON(creditsUrl, function (creditsData) {
            const cast = creditsData.cast.slice(0, 5).map(c => 
                `<span class="clickable" onclick="fetchActorDetails(${c.id})">${c.name}</span>`).join(', ');
            const crew = creditsData.crew.filter(c => c.job === 'Director').map(c => c.name).join(', ');

            const modal = $('#details-modal');
            const details = `
                <h2>${movieData.title}</h2>
                <p><strong>Release Date:</strong> ${movieData.release_date}</p>
                <p><strong>Overview:</strong> ${movieData.overview}</p>
                <p><strong>Genres:</strong> ${movieData.genres.map(g => g.name).join(', ')}</p>
                <p><strong>Rating:</strong> ${movieData.vote_average}/10</p>
                <p><strong>Cast:</strong> ${cast || 'N/A'}</p>
                <p><strong>Director:</strong> ${crew || 'N/A'}</p>
            `;
            $('#movie-details').html(details);
            modal.show(); // Show the modal
        });
    });
}

// Fetch and display actor details
function fetchActorDetails(personId) {
    const url = `${BASE_URL}/person/${personId}?api_key=${API_KEY}`;

    $.getJSON(url, function (data) {
        const modal = $('#details-modal');
        const details = `
            <h2>${data.name}</h2>
            <p><strong>Known For:</strong> ${data.known_for_department}</p>
            <p><strong>Biography:</strong> ${data.biography || 'Biography not available.'}</p>
            <p><strong>Birthday:</strong> ${data.birthday || 'N/A'}</p>
            <p><strong>Place of Birth:</strong> ${data.place_of_birth || 'N/A'}</p>
        `;
        $('#movie-details').html(details);
        modal.show(); // Show the modal
    });
}

// Close modal
$(document).on('click', '.close-btn', function () {
    $('#details-modal').hide(); // Hide the modal
});

// Tab navigation
$('nav ul li a').on('click', function (e) {
    e.preventDefault();
    const target = $(this).attr('href');

    // Hide all sections
    $('section').addClass('hidden');

    // Show the target section
    $(target).removeClass('hidden');

    // Fetch popular movies if the "Popular" tab is clicked
    if (target === '#popular') {
        fetchPopularMovies();
    }
});

// Initial page load
$(document).ready(function () {
    // Load search section by default
    $('#search').removeClass('hidden');

    // Handle search button click
    $('#search-button').on('click', function () {
        const query = $('#search-input').val();
        if (query) {
            searchMovies(query);
        }
    });
});
