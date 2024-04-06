document.addEventListener('DOMContentLoaded', () => {
    let availableTickets; // Declare availableTickets outside renderMovieDetails function

    // Function to fetch the first movie's details and display them on page load
    const fetchFirstMovieDetails = async () => {
        try {
            const response = await fetch('http://localhost:3000/films/1');
            const movieData = await response.json();
            renderMovieDetails(movieData);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    // Function to render all movies in the menu
    const renderMovieMenu = (movies) => {
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = ''; // Clear previous entries
        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.classList.add('film', 'item');

            // Create span element to hold movie title
            const titleSpan = document.createElement('span');
            titleSpan.textContent = movie.title;
            listItem.appendChild(titleSpan);

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                try {
                    const response = await fetch(`http://localhost:3000/films/${movie.id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete movie');
                    }
                    // After successful deletion, re-fetch and render all movies
                    fetchAllMovies();
                } catch (error) {
                    console.error('Error deleting movie:', error);
                }
            });
            listItem.appendChild(deleteButton);

            // Add click event listener to each list item to fetch and render movie details
            listItem.addEventListener('click', () => {
                fetchAndRenderMovieDetails(movie.id);
            });

            // Add the list item to the filmsList
            filmsList.appendChild(listItem);
        });
    };

    // Function to fetch all movies and render them in the menu
    const fetchAllMovies = async () => {
        try {
            const response = await fetch('http://localhost:3000/films');
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const movies = await response.json();
            renderMovieMenu(movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    // Function to fetch and render movie details when a movie is selected from the menu
    const fetchAndRenderMovieDetails = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:3000/films/${movieId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            const movieData = await response.json();
            renderMovieDetails(movieData);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    // Function to render movie details
    const renderMovieDetails = (movieData) => {
        // Update UI with movie details, including available tickets
        document.getElementById('title').textContent = movieData.title;
        document.getElementById('runtime').textContent = `${movieData.runtime} minutes`;
        document.getElementById('film-info').textContent = movieData.description;
        document.getElementById('showtime').textContent = movieData.showtime;
        availableTickets = movieData.capacity - movieData.tickets_sold; // Update availableTickets
        document.getElementById('ticket-num').textContent = availableTickets;
        document.getElementById('poster').src = movieData.poster;

        // Add event listener to the Buy button
        const buyButton = document.getElementById('buy-button');
        buyButton.addEventListener('click', async () => {
            try {
                // Decrease the ticket count by 1
                if (availableTickets > 0) {
                    const response = await fetch(`http://localhost:3000/films/${movieData.id}/buy`, {
                        method: 'POST',
                    });
                    if (!response.ok) {
                        throw new Error('Failed to buy ticket');
                    }
                    // Reload movie details after buying ticket
                    const updatedResponse = await fetch(`http://localhost:3000/films/${movieData.id}`);
                    const updatedMovieData = await updatedResponse.json();
                    availableTickets = updatedMovieData.capacity - updatedMovieData.tickets_sold;
                    document.getElementById('ticket-num').textContent = availableTickets;
                } else {
                    console.log('No available tickets');
                }
            } catch (error) {
                console.error('Error buying ticket:', error);
            }
        });
    };

    // Fetch first movie details when the page loads
    fetchFirstMovieDetails();
    // Fetch all movies and render their titles in the menu
    fetchAllMovies();
});
