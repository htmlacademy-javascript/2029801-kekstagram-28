import {createPostBase} from './post-data.js';

const postContainer = document.querySelector('.pictures');
const postTemplate = document.querySelector('#picture').content;

const generateNewPost = (postBaseElement) => {
  const newPost = postTemplate.cloneNode(true);
  const postImage = newPost.querySelector('.picture__img');
  const postComments = newPost.querySelector('.picture__comments');
  const postLikes = newPost.querySelector('.picture__likes');

  postImage.src = postBaseElement.url;
  postComments.textContent = postBaseElement.comments.length;
  postLikes.textContent = postBaseElement.likes;

  return newPost;
};

const addNewPostsOnSite = (postBase) => {
  const postListFragment = document.createDocumentFragment();

  for (let i = 0; i < postBase.length; i++) {
    const newPost = generateNewPost(postBase[i]);
    postListFragment.appendChild(newPost);
  }

  postContainer.appendChild(postListFragment);
};

addNewPostsOnSite(createPostBase(25));
