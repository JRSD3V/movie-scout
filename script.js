const KEY = "e4402611";
const BASE_URL = "https://www.omdbapi.com/";
const formTitle = document.querySelector("#movieTitle");
const formYear = document.querySelector("#movieYear");
const formBtn = document.querySelector("#buttonSearch");
const movieForm = document.querySelector("#movieForm");
const resultsContainer = document.querySelector("#results");
const clickResultsContainer = document.querySelector("#clickResults");
const clickResultsWrapper = document.querySelector("#clickResultsWrapper");

clickResultsWrapper.addEventListener("click", (e)=> {
    if(e.target.id === "clickResultsWrapper") {
        removeCard();
    }
});

function removeCard() {
    clickResultsContainer.innerHTML = "";
    clickResultsWrapper.classList.remove("show");
    document.body.classList.remove("disableScroll");
}

movieForm.addEventListener("submit", searchMovie);

function searchMovie(e) {
    e.preventDefault();

    const title = formTitle.value.trim();
    const year = formYear.value.trim();

    let apiUrl = `${BASE_URL}?s=${title}&apikey=${KEY}`;
    year ? apiUrl += `&y=${year}` : apiUrl;

    if(!title) {
        alert("Please enter a title");
        return;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if(data.Response === "True") {
                displayMovies(data.Search)
                console.log(data.Search)
            } else {
                resultsContainer.innerHTML = "<p>No movies found.</p>";
            }
        })
        .catch(error => console.error("Error fetching movie data:", error));
}

function displayMovies(movies) {
    resultsContainer.innerHTML = "";
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `<div class="img-wrapper"><img src="${movie.Poster !== 'N/A' ? movie.Poster : 'logo.webp'}" alt="${movie.Title}" class="movie-card-img"></div>
        <div class="movie-card-info">
        <h3 class="movie-card-info-title">${movie.Title} (${movie.Year})</h3>
        <span class="movie-card-info-type">${movie.Type}</span>
        </div>`;

            resultsContainer.appendChild(movieCard);

        movieCard.addEventListener("click", ()=> {
            handleClick(movie.imdbID);
        })
    })
}

function handleClick(imdbID) {
    let apiUrl = `${BASE_URL}?i=${imdbID}&apikey=${KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if(data.Response === "True") {
                console.log(data);
                clickResultsContainer.innerHTML = `
                
                <div class="clickedCard">
                    <button class="clickedCard-close">CLOSE</button>
                    <img src="${data.Poster ? data.Poster : 'logo.webp'}" alt="Placeholder image">
                    <div class="clickedCardInfo">
                    <h3>${data.Title} (${data.Year})</h3>
                        <p class="clickedCard-genre"><span class="clickedCard-label">Genre:</span> ${data.Genre}</p>
                        <p class="clickedCard-genre"><span class="clickedCard-label">Rating:</span> ${data.Rated}</p>
                        <p class="clickedCard-plot">${data.Plot}</p>
                        <p class="clickedCard-director bottom"><span class="clickedCard-label">Director:</span> ${data.Director}</p>
                        <p class="clickedCard-writer bottom"><span class="clickedCard-label">Writers:</span> ${data.Writer}</p>
                        <p class="clickedCard-actors bottom"><span class="clickedCard-label">Actors:</span> ${data.Actors}</p>
                        <p class="clickedCard-runtime bottom"><span class="clickedCard-label">Runtime:</span> ${data.Runtime}</p>
                        <p class="clickedCard-released bottom"><span class="clickedCard-label">Released:</span> ${data.Released}</p>
                        <p class="clickedCard-released bottom"><span class="clickedCard-label">IMDb Rating:</span> ${data.imdbRating}</p>
                        <p class="clickedCard-revenue bottom"><span class="clickedCard-label">Revenue:</span> ${data.BoxOffice}</p>
                        <p class="clickedCard-language bottom"><span class="clickedCard-label">Language:</span> ${data.Language}</p>
                        <p class="clickedCard-country"><span class="clickedCard-label">Country:</span> ${data.Country}</p>
                    </div>
                    <div class="spacer"></div>
                </div>

                `
                clickResultsWrapper.classList.add("show");
                document.body.classList.add("disableScroll");
                closeBtn = clickResultsContainer.querySelector(".clickedCard .clickedCard-close");
                closeBtn.addEventListener("click", removeCard)
            } else {
                clickResultsContainer.innerHTML = "<p>Error fetching movie data.</p>";
            }
        })
        .catch(error => console.error("Error fetching movie data:", error));
}