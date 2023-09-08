const API_KEY = 'api_key=59fa1df362aba6e085744095198c2402';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main');
const form = document.getElementById('form');
const input = document.getElementById('input');
const search_URL = BASE_URL + '/search/movie?sort_by=vote_average.desc&' + API_KEY;
var order = [];
var variavel = '';
const vidsrc = 'https://vidsrc.to/embed/movie/';

getMovies(API_URL);

async function getMovies(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            showMovies(data.results);
        });
}

function showMovies(data) {
    main.innerHTML = '';

    data.sort((a, b) => Number(b.popularity) - Number(a.popularity));

    data.forEach((movie) => {
        const { title, poster_path, vote_average, id } = movie;
        console.log(poster_path)
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.classList.add('gradient-border');
        movieEl.id = `${id}`;
        /* <img src='${IMG_URL + poster_path}' class="imagem" alt='${title}'> */
        movieEl.innerHTML = `
        
        <div id="img${id}" class="imagem"></div>
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        `;

        main.appendChild(movieEl);

        var imgId = document.getElementById(`img${id}`);
        console.log(imgId);
        imgId.style.backgroundImage = `url("${IMG_URL + poster_path}")`;
        imgId.style.backgroundSize = `cover`;
        imgId.addEventListener('click', abrir);

        var imagem = document.getElementById(`img${id}`);
        console.log(imagem);
        imagem.addEventListener('mouseenter', enter);
        imagem.addEventListener('mouseleave', leave);
    });
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = input.value;
    if (searchTerm) {
        getMovies(search_URL + '&query=' + searchTerm);
    } else {
    }
});

function abrir(event) {
    movieId = event.target.offsetParent.id;
    site = "assistirFilmes.html?id=" + movieId;
    window.location.href = site;
}

function enter(event) {
    var div = event.target;
    var childDiv = document.createElement('div');
    childDiv.style.zIndex = '2';
    childDiv.classList.add('childDiv');
    var play = document.createElement('span');
    play.classList.add('material-symbols-outlined');
    play.classList.add('play');
    play.innerText = 'play_circle';
    play.style.fontSize = '90px';
    childDiv.appendChild(play);
    div.appendChild(childDiv);
}

function leave(event) {
    var div = event.target;
    var childDiv = document.querySelector('.childDiv');
    div.removeChild(childDiv);
}
