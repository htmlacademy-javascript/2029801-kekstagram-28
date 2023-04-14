import {getRandomArrayElement} from './utils.js';
import {getPhotosData} from './photos-data.js';
import {renderGallery} from './gallery.js';
import {debounce} from './utils.js';

const RANDOM_IMAGES_COUNT = 10;
const RERENDER__DELAY = 500;

const filtersElement = document.querySelector('.img-filters');
const filtersFormElement = filtersElement.querySelector('.img-filters__form');
const randomFilterButtonElement = document.querySelector('#filter-random');
const discussedFilterButtonElement = document.querySelector('#filter-discussed');
const postContainerElement = document.querySelector('.users-photo');

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
  const currentFilter = filtersFormElement.querySelector('.img-filters__button--active');

  if (evt.target.classList.contains('img-filters__button--active')) {
    return;
  }

  postContainerElement.innerHTML = '';
  let postData = getPhotosData();

  currentFilter.classList.remove('img-filters__button--active');
  evt.target.classList.add('img-filters__button--active');

  switch(evt.target) {
    case randomFilterButtonElement:
      postData = getRandomPictures(postData);
      break;
    case discussedFilterButtonElement:
      postData = getDiscussedPictures(postData);
      break;
    default:
      break;
  }

  renderGallery(postData);
};

filtersFormElement.addEventListener('click', debounce(onFilterButtonClick, RERENDER__DELAY));

export const unblockFilters = () => {
  filtersElement.classList.remove('img-filters--inactive');
};

