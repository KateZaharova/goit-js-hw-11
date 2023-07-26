import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

//const axios = require('axios').default;
const per_page = 40;


let totalHits
let page = 1;
let queryStr


const elements = {
    form: document.querySelector(".search-form"),
    btnSearch: document.querySelector("button"),
    gallery: document.querySelector(".gallery"),
    btnLoadMore:document.querySelector(".load-more")
}

let lightBoxGallery = new SimpleLightbox('.gallery a');


elements.form.addEventListener("submit", handlerFormSubmit)
elements.btnLoadMore.addEventListener("click", loadNextPage)

async function handlerFormSubmit(evt) {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget)
    queryStr = formData.get("searchQuery");
    elements.gallery.innerHTML = "";
    elements.btnLoadMore.style.display = "none"; 
  try {
        page = 1;
        getNewPage()
       } catch (err) {
         console.log(err);
     } finally {
         evt.target.reset()
     } 
}

async function getNewPage() {

    const images = await searchImg(queryStr, page);
    console.log(images);
    if (0===images.length) {
        
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.") 
     }
        elements.gallery.insertAdjacentHTML("beforeend", createMarkup(images));
        lightBoxGallery.refresh()
    if (per_page * page >= totalHits) {
        elements.btnLoadMore.style.display = "none"; 
        return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    } else {
        elements.btnLoadMore.style.display = "block";
    }
}


async function searchImg(itemToSearch, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '38422328-85a02d361c587760bb979b0d3';
    
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${itemToSearch}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
    console.log(response);
    const data = await response.json();
    if (data.totalHits !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    totalHits = data.totalHits;
    return data.hits
}



function createMarkup(arr) {
  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<a class="link" href="${largeImageURL}">
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px" height="200px"/>
  <div class="info ">
    <p class="info-item" id="likes">
      <b id="score-likes">Likes ${likes}</b>
    </p>
    <p class="info-item" id="views">
      <b id="score-views">Views ${views}</b>
    </p>
    <p class="info-item" id="comments">
      <b id="score-comments">Comments ${comments}</b>
    </p>
    <p class="info-item" id="downloads">
      <b id="score-downloads">Downloads ${downloads}</b>
    </p>
  </div>
</div></a>`).join('')
}

function loadNextPage(evt) {
    evt.preventDefault()
    page++;
    getNewPage();
}





