import {getRandomArrayElement} from './utils.js';
import {getPhotosData} from './photos-data.js';
import {renderPosts} from './create-post.js';

const RANDOM_IMAGES_COUNT = 10;

const filtersElement = document.querySelector('.img-filters');
const filtersForm = filtersElement.querySelector('.img-filters__form');
const defaultFilterButton = document.getElementById('filter-default');
const randomFilterButton = document.getElementById('filter-random');
const discussedFilterButton = document.getElementById('filter-discussed');
const postContainer = document.querySelector('.pictures');

export const getRandomPictures = (picturesData) => {
  const randomPictures = [];

  for (let i = 0; randomPictures.length < RANDOM_IMAGES_COUNT; i++) {
    const randomPicture = getRandomArrayElement(picturesData);
    if (!randomPictures.includes(randomPicture)) {
      randomPictures.push(randomPicture);
    }
  }

  return randomPictures;
};

const compareCommentsCount = (elementA, elementB) => {
  const commentsCountA = elementA.comments.length;
  const commentsCountB = elementB.comments.length;

  return commentsCountB - commentsCountA;
};

export const getDiscussedPictures = (picturesData) => picturesData
  .slice()
  .sort(compareCommentsCount);

const setDefaultFilter = (postData) => {
  renderPosts(postData);
};

const setRandomFilter = (postData) => {
  const randomPictures = getRandomPictures(postData);

  renderPosts(randomPictures);
};

const setDiscussedFilter = (postData) => {
  const discussedPictures = getDiscussedPictures(postData);

  renderPosts(discussedPictures);
};

const onFilterButtonClick = (evt) => {
  const postData = getPhotosData();
  const usersPictures = postContainer.querySelectorAll('.picture');
  const currentFilter = filtersForm.querySelector('.img-filters__button--active');

  currentFilter.classList.remove('img-filters__button--active');
  evt.target.classList.add('img-filters__button--active');

  if (evt.target === defaultFilterButton && evt.target !== currentFilter) {
    usersPictures.forEach((userPicture) => postContainer.removeChild(userPicture));
    setDefaultFilter(postData);
  } else if (evt.target === randomFilterButton && evt.target !== currentFilter) {
    usersPictures.forEach((userPicture) => postContainer.removeChild(userPicture));
    setRandomFilter(postData);
  } else if (evt.target === discussedFilterButton && evt.target !== currentFilter) {
    usersPictures.forEach((userPicture) => postContainer.removeChild(userPicture));
    setDiscussedFilter(postData);
  }
};

export const createFilters = () => {
  filtersElement.classList.remove('img-filters--inactive');

  filtersForm.addEventListener('click', onFilterButtonClick);
};

