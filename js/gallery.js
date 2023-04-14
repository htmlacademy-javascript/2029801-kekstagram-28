import {getPhotosData} from './photos-data.js';
import {createPostElement} from './create-post.js';
import {openPost} from './create-post.js';

const postContainerElement = document.querySelector('.users-photo');

export const renderGallery = (postData) => {
  const postListFragment = document.createDocumentFragment();

  postData.forEach((value) => {
    const newPost = createPostElement(value);
    postListFragment.appendChild(newPost);
  });

  postContainerElement.appendChild(postListFragment);
};

const onPostClick = (evt) => {
  const postId = evt.target.dataset.imageId;

  if (postId) {
    const postData = getPhotosData();

    openPost(postData[postId]);
  }
};

postContainerElement.addEventListener('click', onPostClick);
