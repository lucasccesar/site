const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OWZhMWRmMzYyYWJhNmUwODU3NDQwOTUxOThjMjQwMiIsInN1YiI6IjY0ZWJhOTA3YzYxM2NlMDBlYWE5YWUzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H_LhjbrrBxrFa4FEiXXPt4VPn6xDyzvdtiZJ28820uk',
    },
};
const API_KEY = 'api_key=59fa1df362aba6e085744095198c2402';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const upper = document.getElementById('upper');
const movies = document.getElementById('movies');
const lower = document.getElementById('lower');
const btns = document.querySelectorAll('.btn');
const body = document.querySelector('body');
btns.forEach((e) => {
    e.addEventListener('click', mudar);
});
var width = body.offsetWidth;
var height = body.offsetHeight;
var ms = 0;
var currentSuggestion = 0;
var currentTrending = 0;
const trending = document.getElementById('trending');
const trendingMovies = document.getElementById('trendingMovies');
const trendingMoviesBox = document.getElementById('trendingMoviesBox');
var next = document.querySelectorAll('.next');
next.forEach((btn) => {
    btn.addEventListener('click', nextAction);
});
var previous = document.querySelectorAll('.previous');
console.log(previous);
previous.forEach((btn) => {
    btn.addEventListener('click', previousAction);
});
trendingMoviesBox.addEventListener('mouseenter', hoverEnter);
trendingMoviesBox.addEventListener('mouseleave', hoverLeave);
var currentTrendingTranslate = 0;

async function main() {
    var discover = await fetch(`${API_URL}`, options).then((response) => response.json());
    var trendingObj = await fetch(`${API_URL}`, options).then((response) => response.json());
    var trendingResults = trendingObj.results;
    console.log(trendingResults.length / 4);
    var discoverOrder = discover.results.sort((a, b) => Number(b.vote_count) - Number(a.vote_count));
    for (let i = discoverOrder.length; i > 4; i--) {
        discoverOrder.pop();
    }

    discoverOrder.forEach((movie) => {
        let fundo = document.createElement('div');
        fundo.classList.add('fundo');
        let filme = document.createElement('div');
        filme.classList.add('filme');
        filme.style.backgroundImage = `-webkit-linear-gradient(bottom, rgb(5, 21, 30) 0%, rgba(0, 0, 0, 0) 30%) ,url(${IMG_URL + movie.backdrop_path})`;
        filme.innerHTML = `
        <div class='info'>
        <div class='infoInner'>
        <p class="title">${movie.original_title}</p>
        <p class="description">${movie.overview}</p>
        <button class="btnWatch" data-id="${movie.id}"><span class="material-symbols-rounded" id="play_arrow">play_arrow</span>Watch Movie</button>
        </div>
        </div>
        `;

        fundo.appendChild(filme);
        movies.appendChild(fundo);
        if (movie == discoverOrder[3]) {
            let fundo = document.createElement('div');
            fundo.classList.add('fundo');
            let filme = document.createElement('div');
            filme.classList.add('filme');
            filme.style.backgroundImage = `-webkit-linear-gradient(bottom, rgb(5, 21, 30) 0%, rgba(0, 0, 0, 0) 30%) ,url(${IMG_URL + discoverOrder[0].backdrop_path})`;
            filme.innerHTML = `
            <div class='info'>
            <div class='infoInner'>
            <p class="title">${discoverOrder[0].original_title}</p>
            <p class="description">${discoverOrder[0].overview}</p>
            <button class="btnWatch" data-id="${movie.id}"><span class="material-symbols-rounded" id="play_arrow">play_arrow</span>Watch Movie</button>
            </div>
            </div>
            `;

            fundo.appendChild(filme);
            movies.appendChild(fundo);
        }
    });

    for (let i = 0; i < trendingResults.length / 4; i++) {
        let div = document.createElement('div');
        div.classList.add('trendingPartitions');
        if (i == 0) {
            div.classList.add('trendingPartitionsFirst');
        }
        for (let j = 0; j < 4; j++) {
            let divMovies = document.createElement('div');
            divMovies.classList.add('movie');
            divMovies.innerHTML = `
            <div class="movieBackdrop" style="background-image: url('${IMG_URL + trendingResults[j + i * 4].backdrop_path}')"></div>
            <div class="movieInfo"><p class="title">${
                trendingResults[j + i * 4].title
            }</p><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg></div>
            `;
            div.appendChild(divMovies);
        }
        trendingMovies.appendChild(div);
    }

    var btns = document.querySelectorAll('.btnWatch');
    console.log(btns);
    btns.forEach((btn) => {
        btn.addEventListener('click', openR);
    });

    setInterval(suggestion, 1);
}

function nextAction(event) {
    var trendingPartitions = document.querySelectorAll('.trendingPartitions');
    if (currentTrending < trendingPartitions.length - 1) {
        currentTrendingTranslate -= (80 / 100) * window.innerWidth + (trending.offsetWidth - 4 * document.querySelector('.movie').offsetWidth) / 3;
        console.log(currentTrendingTranslate);
        trendingMovies.style.transform = `translateX(${currentTrendingTranslate}px)`;
        currentTrending++;
        if(currentTrending>0){
            trendingMoviesBox.children[0].classList.replace('hidden', 'visible');
        }
        if(currentTrending==trendingPartitions.length-1){
            trendingMoviesBox.children[2].classList.replace('visible', 'hidden')
        }
    }
}

function previousAction(event) {
    var trendingPartitions = document.querySelectorAll('.trendingPartitions');
    if (currentTrending > 0) {
        currentTrendingTranslate += (80 / 100) * window.innerWidth + (trending.offsetWidth - 4 * document.querySelector('.movie').offsetWidth) / 3;
        console.log(currentTrendingTranslate);
        trendingMovies.style.transform = `translateX(${currentTrendingTranslate}px)`;
        currentTrending--;
        console.log(currentTrending)
        if(currentTrending<trendingPartitions.length-1){
            trendingMoviesBox.children[2].classList.replace('hidden', 'visible');
        }
        if(currentTrending==0){
            trendingMoviesBox.children[0].classList.replace('visible', 'hidden')
        }
    }
}

function hoverEnter(event) {
    if (currentTrending != 0) {
        event.target.children[0].classList.replace('hidden', 'visible');
    }
    if (currentTrending < event.target.children[1].children.length - 1) {
        event.target.children[2].classList.replace('hidden', 'visible');
    }
    console.log(event.target.children[1].children.length);
}

function hoverLeave(event) {
    event.target.children[0].classList.replace('visible', 'hidden');
    event.target.children[2].classList.replace('visible', 'hidden');
}

function openR(event) {
    console.log(event.target.dataset.id);
    movieId = event.target.dataset.id;
    site = 'assistirFilmes.html?id=' + movieId; /* aaaaaa */
    window.location.href = site;
}

async function mudar(event) {
    const fundos = document.querySelectorAll('.fundo');
    console.log(fundos);
    let loading = document.querySelector('.btnLoading');
    console.log(event);
    console.log(event.target.classList);
    if (event.target.firstElementChild != null && event.target.firstElementChild.classList[0] != 'btnLoading') {
        for (let i = 0; i < 4; i++) {
            if (event.target == btns[i] || event.target.parentElement == btns[i]) {
                movies.classList.add('delay');
                movies.style.transform = `translateX(-${width * i}px)`;
                currentSuggestion = i;
            }
            if (event.target == btns[i]) {
                event.target.firstElementChild.classList.add('btnLoading');
                loading.classList.remove('btnLoading');
                ms = 0;
            } else if (event.target.parentElement == btns[i]) {
                event.target.classList.add('btnLoading');
                loading.classList.remove('btnLoading');
                ms = 0;
            }
        }
    } else if (event.target.classList[0] == 'btnLoading' || event.target.firstElementChild.classList[0] == 'btnLoading') {
        ms = 0;
    }
}

function suggestion() {
    width = body.offsetWidth;
    let movieSla = movies.getBoundingClientRect();
    trendingMovies.style.gap = `${(trending.offsetWidth - 4 * document.querySelector('.movie').offsetWidth) / 3}px`;
    document.querySelectorAll('.pass').forEach((btn) => {
        btn.style.width = `${(10 / 100) * window.innerWidth - (trending.offsetWidth - 4 * document.querySelector('.movie').offsetWidth) / 3}px`;
    });
    if (movieSla.left == -(width * 4)) {
        let loading = document.querySelector('.btnLoading');
        movies.classList.remove('delay');
        loading.classList.remove('btnLoading');
        movies.style.transform = `translateX(0px)`;
        btns[0].firstElementChild.classList.add('btnLoading');
    }
    ms++;
    var loading = document.querySelector('.btnLoading');
    loading.style.width = `${ms / 15}%`;
    if (ms / 15 == 100) {
        ms = 0;
        trocar();
    }
}

function trocar() {
    const fundos = document.querySelectorAll('.fundo');
    currentSuggestion++;
    let loading = document.querySelector('.btnLoading');
    if (currentSuggestion == 4) {
        btns[0].firstElementChild.classList.add('btnLoading');
        loading.classList.remove('btnLoading');
        movies.style.transform = `translateX(-${width * currentSuggestion}px)`;
        console.log('trocou');
        currentSuggestion = 0;
    } else if (loading.parentElement.nextElementSibling != null) {
        movies.classList.add('delay');
        console.log('aqui');
        loading.style.width = `0%`;
        loading.parentElement.nextElementSibling.firstElementChild.classList.add('btnLoading');
        loading.classList.remove('btnLoading');
        movies.style.transform = `translateX(-${width * currentSuggestion}px)`;
    }
}

main();
