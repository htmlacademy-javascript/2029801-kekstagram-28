import {isEscapeKey} from './utils.js';

const AVATAR_WIDTH = '35';
const AVATAR_HEIGHT = '35';
const DEFAULT_COMMENTS_COUNT = 5;

const overlayElement = document.querySelector('.big-picture');
const closeButtonElement = overlayElement.querySelector('.big-picture__cancel');
const imageContainerElement = overlayElement.querySelector('.big-picture__img');
const imageElement = imageContainerElement.querySelector('img');
const likesCounterElement = overlayElement.querySelector('.likes-count');
const commentsCountElement = overlayElement.querySelector('.comments-count');
const moreCommentsButtonElement = overlayElement.querySelector('.comments-loader');
const postCaptionElement = overlayElement.querySelector('.social__caption');
const commentsListElement = overlayElement.querySelector('.social__comments');
const postTemplateElement = document.querySelector('#picture').content;

let visibleCommentsCount = DEFAULT_COMMENTS_COUNT;
let currentPost = null;

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt.key)) {
    evt.preventDefault();
    closeOverlay();
  }
};

const onCloseButtonClick = () => {
  closeOverlay();
};

// function для хостинга
function closeOverlay () {
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButtonElement.addEventListener('click', onCloseButtonClick);

export const createPostElement = (postBaseElement) => {
  const newPost = postTemplateElement.cloneNode(true);
  const newPostImage = newPost.querySelector('.picture__img');
  const newPostComments = newPost.querySelector('.picture__comments');
  const newPostLikes = newPost.querySelector('.picture__likes');

  newPostImage.dataset.imageId = postBaseElement.id;
  newPostImage.src = postBaseElement.url;
  newPostComments.textContent = postBaseElement.comments.length;
  newPostLikes.textContent = postBaseElement.likes;

  return newPost;
};

const createComment = (commentData) => {
  const newComment = document.createElement('li');
  newComment.classList.add('social__comment');

  const commentatorAvatar = document.createElement('img');
  commentatorAvatar.classList.add('social__picture');
  commentatorAvatar.src = commentData.avatar;
  commentatorAvatar.alt = commentData.name;
  commentatorAvatar.width = AVATAR_WIDTH;
  commentatorAvatar.height = AVATAR_HEIGHT;
  newComment.appendChild(commentatorAvatar);

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = commentData.message;
  newComment.appendChild(commentText);

  return newComment;
};

const renderComments = (commentsData) => {
  commentsData.forEach((value) => {
    const newComment = createComment(value);

    commentsListElement.appendChild(newComment);
  });

  if (commentsData.length === currentPost.comments.length) {
    moreCommentsButtonElement.classList.add('hidden');
  }

  commentsCountElement.textContent = `${commentsData.length} из ${currentPost.comments.length}`;
};

const onMoreCommentsButtonClick = () => {
  visibleCommentsCount += DEFAULT_COMMENTS_COUNT;
  const slicedComments = currentPost.comments.slice(0, visibleCommentsCount);
  commentsListElement.innerHTML = '';

  renderComments(slicedComments);
};

moreCommentsButtonElement.addEventListener('click', onMoreCommentsButtonClick);

export const openPost = (post) => {
  overlayElement.classList.remove('hidden');

  currentPost = post;
  const {url, description, likes, comments} = currentPost;
  visibleCommentsCount = DEFAULT_COMMENTS_COUNT;
  const slicedComments = comments.slice(0, visibleCommentsCount);

  document.addEventListener('keydown', onDocumentKeydown);
  document.body.classList.add('modal-open');

  if (slicedComments.length < comments.length) {
    moreCommentsButtonElement.classList.remove('hidden');
  }

  commentsCountElement.textContent = comments.length;
  imageElement.src = url;
  likesCounterElement.textContent = likes;
  postCaptionElement.textContent = description;
  commentsListElement.innerHTML = '';

  renderComments(slicedComments);
};

