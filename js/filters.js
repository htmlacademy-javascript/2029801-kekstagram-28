import {getRandomArrayElement} from './utils.js';
import {getPhotosData} from './photos-data.js';
import {renderGallery} from './gallery.js';
import {debounce} from './utils.js';

const RANDOM_IMAGES_COUNT = 10;
const RERENDER__DELAY = 500;

const filtersElement = document.querySelector('.img-filters');
const filtersForm = filtersElement.querySelector('.img-filters__form');
const randomFilterButton = document.getElementById('filter-random');
const discussedFilterButton = document.getElementById('filter-discussed');
const postContainer = document.querySelector('.users-photo');

export const getRandomPictures = (picturesData) => {
  const randomPictures = [];
  let imagesCount = RANDOM_IMAGES_COUNT;

  if (picturesData.length < RANDOM_IMAGES_COUNT) {
    imagesCount = picturesData.length;
  }

  while (randomPictures.length < imagesCount) {
    const randomPicture = getRandomArrayElement(picturesData);

    if (!randomPictures.includes(randomPicture)) {
      randomPictures.push(randomPicture);
    }
  }

  return randomPictures;
};

const getDiscussedPictures = (picturesData) => picturesData.sort((elementA, elementB) => elementB.comments.length - elementA.comments.length);

const onFilterButtonClick = (evt) => {
  const currentFilter = filtersForm.querySelector('.img-filters__button--active');

  if (evt.target === currentFilter) {
    return;
  }

  postContainer.innerHTML = '';
  let postData = getPhotosData();

  currentFilter.classList.remove('img-filters__button--active');
  evt.target.classList.add('img-filters__button--active');

  switch(evt.target) {
    case randomFilterButton:
      postData = getRandomPictures(postData);
      break;
    case discussedFilterButton:
      postData = getDiscussedPictures(postData);
      break;
    default:
      break;
  }

  renderGallery(postData);
};

filtersForm.addEventListener('click', debounce(onFilterButtonClick, RERENDER__DELAY));

export const unblockFilters = () => {
  filtersElement.classList.remove('img-filters--inactive');
};

