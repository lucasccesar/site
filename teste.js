const API_KEY = 'api_key=59fa1df362aba6e085744095198c2402';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/tv?sort_by=vote_count.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main');
const form = document.getElementById('form');
const input = document.getElementById('input');
const search_URL = BASE_URL + '/search/tv?sort_by=vote_average.desc&' + API_KEY;
var order = [];
var variavel = '';
const vidsrc = 'https://vidsrc.to/embed/tv/';
var seasonNum = 1;

getTvs(API_URL);

async function getTvs(url) {
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            showTvs(data.results);
        });
}

function showTvs(data) {
    main.innerHTML = '';

    console.log(data);

    data.sort((a, b) => Number(b.popularity) - Number(a.popularity));

    data.forEach(async (tv) => {
        const { name, poster_path, vote_average, id } = tv;
        const tvEl = document.createElement('div');
        tvEl.classList.add('movie');
        tvEl.classList.add('gradient-border');
        tvEl.id = `${id}`;
        var tvInformation = await tvInfo(id);
        console.log(tvInformation.last_episode_to_air);
        tvEl.innerHTML = `
        
        <div id="img${id}" class="imagem"></div>
        <div class="movie-info">
        <h3>${name}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div id="selects">
        <select id="selectSeason${id}" class="select" onchange="seasonInfo(parentElement.parentElement.id)"></select>
        <select id="selectEpisode${id}" class="select"></select>
        </div>
        `;

        main.appendChild(tvEl);

        var imgId = document.getElementById(`img${id}`)
        console.log(imgId)
        imgId.style.backgroundImage = `url("${IMG_URL + poster_path}")`
        imgId.style.backgroundSize = `cover`
        imgId.addEventListener("click", abrir)

        var imagem = document.getElementById(`img${id}`)
        console.log(imagem)
        imagem.addEventListener("mouseenter", enter)
        imagem.addEventListener("mouseleave", leave)
        imagem.addEventListener('click', abrir);

        var select1 = document.getElementById(`selectSeason${id}`);

        for (i = 0; i < tvInformation.last_episode_to_air.season_number; i++) {
            var option = document.createElement('option');
            option.value = `${i + 1}`;
            option.innerHTML = `Temporada ${i + 1}`;
            select1.appendChild(option);
        }
        var seasonInformation = await seasonInfo(id);
    });
}

function seasonFunc(){
    
}

async function tvInfo(id) {
    var x = await fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US&${API_KEY}`)
        .then((response) => response.json())
        .catch((err) => console.error(err));

    return x;
}

async function seasonInfo(id) {
    document.getElementById(`selectEpisode${id}`).innerHTML = '';
    var seasonNum = document.getElementById(`selectSeason${id}`).value;
    var select2 = document.getElementById(`selectEpisode${id}`);
    var y = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNum}?language=en-US&${API_KEY}`)
        .then((response) => response.json())
        .catch((err) => console.error(err));
    for (i = 0; i < y.episodes.length; i++) {
        var option = document.createElement('option');
        option.value = `${i + 1}`;
        option.innerHTML = `Episódio ${i + 1}`;
        select2.appendChild(option);
    }
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
        getTvs(search_URL + '&query=' + searchTerm);
    } else {
        console.log('gay');
    }
});

function abrir(event){
    tvId = event.target.offsetParent.id
    var temporada = document.getElementById(`selectSeason${tvId}`).value;
    var episodio = document.getElementById(`selectEpisode${tvId}`).value;
    site = vidsrc + tvId + '/' + temporada + '/' + episodio;
    window.location.href = site
}

function enter(event){
    var div = event.target
    var childDiv = document.createElement('div')
    childDiv.style.zIndex = "2"
    childDiv.classList.add("childDiv")
    var play = document.createElement('span');
    play.classList.add("material-symbols-outlined")
    play.classList.add("play")
    play.innerText = "play_circle"
    play.style.fontSize = "90px"
    childDiv.appendChild(play)
    div.appendChild(childDiv)
}

function leave(event){
    var div = event.target
    var childDiv = document.querySelector(".childDiv")
    div.removeChild(childDiv)
}