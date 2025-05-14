const global = {
    currentPage : window.location.pathname,
    search : {
        term :'',
        type :'',
        page : 1,
        totalPages :1,
        totalResults:0
    },
    API_KEY : '502bdb9b7bb9ec5a4307f1606964d6c1',
    API_URL : 'https://api.themoviedb.org/3/',
};

async function displayPopularMovies(){
    const {results} = await fetchAPIData('movie/popular');
   // console.log(results);
    const popular_movie_div = document.querySelector('#popular-movies');
    results.forEach((movieEl)=>{
        const movieDOM = createDOMElement(movieEl,'moviesPage');
        popular_movie_div.appendChild(movieDOM);
    });
}

async function displayPopularTVShows(){
    const {results} = await fetchAPIData('tv/popular');
    const popular_show_div = document.querySelector('#popular-shows');
    console.log(results);
    results.forEach((showEl)=>{
        const showDOM = createDOMElement(showEl,'tvShowsPage');
        popular_show_div.appendChild(showDOM);
    });
    
}


async function displayMovieDetails(){
    const movieId = window.location.search.split('=')[1];

    const movie_details = await fetchAPIData(`movie/${movieId}`);
    //overLay of Backgrounf image;
    displayBackgrounfImage('movie',movie_details.backdrop_path);

    createmovieDetailsDOM(movie_details);
    console.log(movie_details);
    
}

async function displayShowDetails(){
    const showId = window.location.search.split('=')[1];

    const show_details = await fetchAPIData(`tv/${showId}`);
    console.log(show_details);
    //overLay of Backgrounf image;
    displayBackgrounfImage('tv',show_details.backdrop_path);

    createShowDetailsDOM(show_details);
    
}


//creation of DOM element

function createDOMElement(ele,fromPage){
    //img
    const img = document.createElement('img');
    img.className = 'card-img-top';
    ele.poster_path ? img.src = `https://image.tmdb.org/t/p/w500${ele.poster_path}` : img.src = '../images/no-image.jpg';
    img.alt =ele.title;
    
    //a
    const a = document.createElement('a');

    a.href = `movie-details.html?id=${ele.id}`;
    fromPage === 'moviesPage'?  a.href = `movie-details.html?id=${ele.id}`:  a.href = `tv-details.html?id=${ele.id}`;
    a.appendChild(img);
 
    //outerDiv
    const outerDiv = document.createElement('div');
    outerDiv.className = 'card';
    outerDiv.appendChild(a);

    // text Node
    fromPage === 'moviesPage'? release_node = document.createTextNode(`Release:${ele.release_date}`):release_node = document.createTextNode(`Release:${ele.first_air_date}`) ;

    //small
    const small = document.createElement('small');
    small.className = 'text-muted';
    small.appendChild(release_node);


    //h5
    const h5= document.createElement('h5');
    h5.className = 'card-title';
    fromPage === 'moviesPage'?  movie_title = document.createTextNode(ele.title) : movie_title = document.createTextNode(ele.name);

    h5.appendChild(movie_title);

    //p
    const p = document.createElement('p');
    p.className ='card-text';
    p.appendChild(small);


    //innerdiv

    const innerdiv = document.createElement('div');
    innerdiv.className='card-body';

    innerdiv.appendChild(h5);
    innerdiv.appendChild(p);

    outerDiv.appendChild(innerdiv);


   return outerDiv;


}



//movie-Details DOM 
function createmovieDetailsDOM(ele){
    const movie_details_block = document.querySelector('#movie-details');
    console.log(movie_details_block);
    const div = document.createElement('div');
    div.innerHTML=`
     <div class="details-top">
          <div>
            ${
            ele.poster_path ?
                `<img
              src= "https://image.tmdb.org/t/p/w500${ele.poster_path}"
              class="card-img-top"
              alt =${ele.title}
            />`
            :
            `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt=${ele.title}
            />`
            }
          </div>
          <div>
            <h2>${ele.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${ele.vote_average.toFixed(1)} /10
            </p>
            <p class="text-muted">Release Date:${ele.release_date}</p>
            <p>
            ${ele.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${ele.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${ele.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${ele.budget}</li>
            <li><span class="text-secondary">Revenue:</span> $${ele.revenue}</li>
            <li><span class="text-secondary">Runtime:</span> ${ele.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${ele.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${
            ele.production_companies.map((comp)=>`<span>${comp.name}</span>`).join('')}
          </div>
        </div>`;
        movie_details_block.appendChild(div);
}

//Show-Details DOM 
function createShowDetailsDOM(ele){
    const show_details_block = document.querySelector('#show-details');
    const div = document.createElement('div');
    div.innerHTML=`
     <div class="details-top">
          <div>
            ${
            ele.poster_path ?
                `<img
              src= "https://image.tmdb.org/t/p/w500${ele.poster_path}"
              class="card-img-top"
              alt =${ele.name}
            />`
            :
            `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt=${ele.name}
            />`
            }
          </div>
          <div>
            <h2>${ele.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${ele.vote_average.toFixed(1)} /10
            </p>
            <p class="text-muted">Release Date:${ele.last_air_date}</p>
            <p>
            ${ele.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${ele.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${ele.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
           <li><span class="text-secondary">Number Of Episodes:</span> ${ele.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span>${ele.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${ele.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${
            ele.production_companies.map((comp)=>`<span>${comp.name}</span>`).join('')}
          </div>
        </div>`;
        show_details_block.appendChild(div);
}



//search results
function displaysesrchResults(results){
  clearPreviousResults();
  results.forEach(ele => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML=`
    <a href="${global.search.type}-details.html?id=${ele.id}">
            <img src="https://image.tmdb.org/t/p/w500${ele.poster_path}" class="card-img-top" alt="" />
          </a>
          <div class="card-body">
          ${
           global.search.type === 'movie' ? `<h5 class="card-title">${ele.title}</h5>` :`<h5 class="card-title">${ele.name}</h5>`
          }
            <p class="card-text">
            ${
              global.search.type === 'movie' ? `<small class="text-muted">Release: ${ele.release_date}</small>` : `<small class="text-muted">Release: ${ele.first_air_date}</small>`
             }
            </p>
          </div>
    `;

    document.querySelector('#search-results-heading').innerHTML= 
    `<h2> ${results.length} of ${global.search.totalResults} for a ${global.search.term}</h2>`;
    document.querySelector('.grid').appendChild(div);
    
  });
//display pagination for search 
displayPagination();
}

function displayPagination(){
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML=`<button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;
  document.querySelector('#pagination').appendChild(div);

  //Disable  prev button if on first page 
  if(global.search.page ===1){
    document.querySelector('#prev').disabled = true;
  }
  //Disable  next button if on last page 
  if(global.search.page === global.search.totalPages){
    document.querySelector('#next').disabled = true;
    }
    document.querySelector('#next').addEventListener('click',async()=>
    {
      global.search.page++;
      const {results,total_pages} = await seachAPIData();
      displaysesrchResults(results);
    });
    document.querySelector('#prev').addEventListener('click',async() =>{
      global.search.page--;
      const {results,total_pages} = await seachAPIData();
      displaysesrchResults(results);

    })


}

function clearPreviousResults(){
  document.querySelector('#search-results').innerHTML='';
  document.querySelector('#search-results-heading').innerHTML='';
  document.querySelector('#pagination').innerHTML='';

}

function displayBackgrounfImage(type,bg_path){

    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage= `url(https://image.tmdb.org/t/p/original/${bg_path})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if(type === 'movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv);
    }else{
        document.querySelector('#show-details').appendChild(overlayDiv);

    }
}


//search Page 

async function search(){
    const queryString = window.location.search;
    const  urlParams = new URLSearchParams(queryString);


    global.search.type =urlParams.get('type');
    global.search.term =urlParams.get('search-term');


    if (global.search.term !== '' && global.search.term !== null){
        const {results, total_pages, page,total_results} = await seachAPIData();

        global.search.page = page;
        global.search.totalPages= total_pages;
        global.search.totalResults=total_results;


        if(results.length === 0){
          showAlert('no results Found');
        }else{
            console.log(results);
            //add to Dom 
            displaysesrchResults(results);
         // document.querySelector('#search-term').value ='';

        }
    }else{
        showAlert('please enter something');
    }

}


function showAlert(mesasge,className = 'error'){
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert',className);
    alertEl.appendChild(document.createTextNode(mesasge));
    document.querySelector('#alert').appendChild(alertEl);
    
    setTimeout(()=>alertEl.remove(),2000);

}

//Display Slider Movies 
async function displaySlider(){
    const {results} = await fetchAPIData('movie/now_playing');
    results.forEach(ele => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
            <a href="movie-details.html?id=${ele.id}">
              <img src="https://image.tmdb.org/t/p/w500${ele.poster_path}" alt=${ele.title} />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${ele.vote_average} / 10
            </h4>`;
        document.querySelector('.swiper-wrapper').appendChild(div);
        initSwipper();   
        
    });

  }

  function initSwipper(){
    const swiper = new Swiper('.swiper',{
        slidesPerView :1,
        spaceBetween :30,
        freeMode:true,
        loop:true,
        autoplay :{
            delay:4000,
            disableOnInteraction:false
        },
        breakpoints :{
            500:{
                slidesPerView:2
            },
            700:{
                slidesPerView:3
            },
            800:{
                slidesPerView:5
            },
            1200:{
                slidesPerView:7
            },

        }
    })
  }


//show spinner

function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}

//hide Spinner 
function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}



//fetch data from TMDB API 

async function fetchAPIData(endpoint){

    const api_url = global.API_URL;
    const api_key = global.API_KEY;

    showSpinner();
    const reponse = await fetch(`${api_url}${endpoint}?api_key=${api_key}& language=en-US`);
    const data = await reponse.json();
    hideSpinner();
    return data;

}

//search 

async function seachAPIData(){
    
    const api_url = global.API_URL;
    const api_key = global.API_KEY;

    const response = await fetch(`${api_url}search/${global.search.type}?api_key=${api_key}& language=en-US&query=${global.search.term}&page=${global.search.page}`);
  
    const data = await response.json();

    return data;


}

//hightligt Active Link
function hightlightActiveLink(){
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if(link.getAttribute('href') === global.currentPage){
            link.classList.add('active');
        }
    });
}

//intialising the APP
function init(){
    switch(global.currentPage){
        case '/flixx-app/':
        case '/flixx-app/index.html':
          displayPopularMovies();
          displaySlider();
          console.log('Home');
          break;
        case '/flixx-app/shows.html':
            displayPopularTVShows();
            console.log('Shows');
            break;
        case '/flixx-app/movie-details.html':
            displayMovieDetails();
            console.log('Movie Details');
            break;
        case '/flixx-app/tv-details.html':
            displayShowDetails();
            console.log('TV Details');
            break;
        case '/flixx-app/search.html':
            search();
            console.log('Search');
            break;        
    }
    hightlightActiveLink();
}


//Event Listeners

document.addEventListener('DOMContentLoaded',init);

