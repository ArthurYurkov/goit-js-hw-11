import './styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
var lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt' });

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

let searchQuery = '';
let page = 1;

refs.searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', () => {
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight > scrollHeight - 5) {
    onLoadMore();
  }
});

function onSearch(event) {
  event.preventDefault();

  searchQuery = event.currentTarget.searchQuery.value;
  resetPage();
  axios
    .get(
      `https://pixabay.com/api/?key=31234346-99e51484fd3cfaa63b80cb557&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
    )
    .then(res => {
      if (res.data.hits.length > 0) {
        Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
      }
      if (res.data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      createMarkup(res.data.hits);
      lightbox.refresh();
      page++;
    })
    .catch(error => error);
}

function onLoadMore() {
  axios
    .get(
      `https://pixabay.com/api/?key=31234346-99e51484fd3cfaa63b80cb557&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(res => {
      if (res.data.hits.length === 0) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
      createMarkup(res.data.hits);
      page++;
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2 + 150,
        behavior: 'smooth',
      });
    })
    .catch(error => error);
}

function resetPage() {
  page = 1;
  refs.gallery.innerHTML = '';
}

function createMarkup(data) {
  const markup = data.map(
    item => `<div class="photo-card"><div class="gallery"> <a  href="${item.largeImageURL}">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />  </a></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`
  );
  refs.gallery.insertAdjacentHTML('beforeend', markup.join(''));
}
