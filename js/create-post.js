import {renderGallery} from './gallery.js';
import {getPhotosData} from './photos-data.js';

const postContainer = document.querySelector('.users-photo');
const postTemplate = document.querySelector('#picture').content;


const createPostElement = (postBaseElement) => {
  const newPost = postTemplate.cloneNode(true);
  const newPostImage = newPost.querySelector('.picture__img');
  const newPostComments = newPost.querySelector('.picture__comments');
  const newPostLikes = newPost.querySelector('.picture__likes');

  newPostImage.dataset.imageId = postBaseElement.id;
  newPostImage.src = postBaseElement.url;
  newPostComments.textContent = postBaseElement.comments.length;
  newPostLikes.textContent = postBaseElement.likes;

  return newPost;
};

const onPostClick = (evt) => {
  const postData = getPhotosData();
  const postId = evt.target.dataset.imageId;
  renderGallery(postData[postId]);
};

postContainer.addEventListener('click', onPostClick);

export const renderPosts = (postData) => {
  const postListFragment = document.createDocumentFragment();

  for (const value of postData) {
    const newPost = createPostElement(value);
    postListFragment.appendChild(newPost);
  }

  postContainer.appendChild(postListFragment);
};
