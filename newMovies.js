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
const body = document.querySelector("body")
btns.forEach((e) => {
    e.addEventListener('click', mudar);
});
var ms = 0;
var current = 0;

async function main() {
    var discover = await fetch(`${API_URL}`, options).then((response) => response.json());
    var discoverOrder = discover.results.sort((a, b) => Number(b.vote_count) - Number(a.vote_count));
    for (let i = discoverOrder.length; i > 4; i--) {
        discoverOrder.pop();
    }
    console.log(discoverOrder);

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
        <button class="btnWatch"><span class="material-symbols-rounded" id="play_arrow">play_arrow</span>Watch Movie</button>
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
            <button class="btnWatch"><span class="material-symbols-rounded" id="play_arrow">play_arrow</span>Watch Movie</button>
            </div>
            </div>
            `;

            fundo.appendChild(filme);
            movies.appendChild(fundo);
        }
    });

    setInterval(suggestion, 1);
}

async function mudar(event) {
    const fundos = document.querySelectorAll('.fundo');
    let loading = document.querySelector('.btnLoading');
    console.log(event);
    console.log(event.target.classList);
    if (event.target.firstElementChild != null && event.target.firstElementChild.classList[0] != 'btnLoading') {
        for (let i = 0; i < 4; i++) {
            if (event.target == btns[i] || event.target.parentElement == btns[i]) {
                fundos[i].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start',
                });
                current = i;
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
    /* console.log(window.scrollY) ---------------------------AQUI--------------------------------*/
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
    current++;
    let loading = document.querySelector('.btnLoading');
    if (current == 4) {
        btns[0].firstElementChild.classList.add('btnLoading');
        loading.classList.remove('btnLoading');
        fundos[current].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
        });
        setTimeout(()=>{
            btns[0].firstElementChild.classList.add('btnLoading');
            loading.classList.remove('btnLoading');
            fundos[current].scrollIntoView({
                behavior: 'instant',
                block: 'nearest',
                inline: 'start',
            });
        }, 1000)
        current = 0;
    } else if (loading.parentElement.nextElementSibling != null) {
        console.log('aqui');
        loading.style.width = `0%`;
        loading.parentElement.nextElementSibling.firstElementChild.classList.add('btnLoading');
        loading.classList.remove('btnLoading');
        fundos[current].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start',
        });
    }
}

main();
