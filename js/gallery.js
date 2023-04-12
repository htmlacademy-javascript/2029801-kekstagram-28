import {getPhotosData} from './photos-data.js';
import {createPostElement} from './create-post.js';
import {openPost} from './create-post.js';

const postContainer = document.querySelector('.users-photo');

export const renderGallery = (postData) => {
  const postListFragment = document.createDocumentFragment();

  for (const value of postData) {
    const newPost = createPostElement(value);
    postListFragment.appendChild(newPost);
  }

  postContainer.appendChild(postListFragment);
};

const onPostClick = (evt) => {
  const postId = evt.target.dataset.imageId;

  if (postId) {
    const postData = getPhotosData();

    openPost(postData[postId]);
  }
};

postContainer.addEventListener('click', onPostClick);
