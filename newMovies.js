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
const upper = document.getElementById("upper")
const movies = document.getElementById("movies")
const lower = document.getElementById("lower")
const btns = document.querySelectorAll(".btn")
btns.forEach(e => {
    e.addEventListener("click", mudar)
});
var ms = 0
var current = 0

async function main() {
    var discover = await fetch(`${API_URL}`, options).then((response) => response.json());
    var discoverOrder = discover.results.sort((a, b) => Number(b.vote_count) - Number(a.vote_count));
    for(let i=discoverOrder.length; i>4; i--){
        discoverOrder.pop()
    }
    console.log(discoverOrder)

    discoverOrder.forEach(movie => {
        let fundo = document.createElement("div")
        fundo.classList.add("fundo")
        let filme = document.createElement("div")
        filme.classList.add("filme")
        filme.style.backgroundImage = `-webkit-linear-gradient(bottom, rgb(5, 21, 30) 0%, rgba(0, 0, 0, 0) 30%) ,url(${IMG_URL + movie.backdrop_path})`

        fundo.appendChild(filme)
        movies.appendChild(fundo)
    });

    setInterval(suggestion, 1)
}

async function mudar(event){
    const fundos = document.querySelectorAll(".fundo")
    console.log(event)
    for(let i = 0; i<4; i++){
        if(event.target == btns[i] || event.target.parentElement == btns[i]){
            fundos[i].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    }
}

function suggestion(){
    ms++
    var loading = document.querySelector(".btnLoading")
    loading.style.width = `${ms/15}%`
    if(ms/15==100){
        ms = 0
        trocar()
    }
}

function trocar(){
    const fundos = document.querySelectorAll(".fundo")
    current ++
    var loading = document.querySelector(".btnLoading")
    if(loading.parentElement.nextElementSibling != null){
        loading.parentElement.nextElementSibling.firstElementChild.classList.add("btnLoading")
        loading.classList.remove("btnLoading")
        fundos[current].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
    } else {
        current = 0
        btns[0].firstElementChild.classList.add("btnLoading")
        loading.classList.remove("btnLoading")
        fundos[current].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
    }
}

main()