import axios from 'axios';
import { Notify } from 'notiflix';

const API_IMG_URL = 'https://pixabay.com/api/';

export async function fetchImg(inputName, page) {
  try {
    const response = await axios.get(API_IMG_URL, {
      method: 'get',
      params: {
        key: '31234346-99e51484fd3cfaa63b80cb557',
        q: inputName,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: page,
      },
    });
    if (response.data.totalHits === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (response.data.totalHits > 0) {
      return Notify.success(
        'Hooray! We found ${response.data.totalHits} images.'
      );
    }
    return data;
  } catch (error) {
    console.log('error');
  }
}
