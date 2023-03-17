import {isEscapeKey} from './utils.js';

const AVATAR_WIDTH = '35';
const AVATAR_HEIGHT = '35';
const overlay = document.querySelector('.big-picture');
const closeButton = overlay.querySelector('.big-picture__cancel');
const imageContainer = overlay.querySelector('.big-picture__img');
const image = imageContainer.querySelector('img');
const likes = overlay.querySelector('.likes-count');
const commentsCounter = overlay.querySelector('.social__comment-count');
const commentsCount = overlay.querySelector('.comments-count');
const moreCommentsButton = overlay.querySelector('.comments-loader');
const postCaption = overlay.querySelector('.social__caption');
const commentsList = overlay.querySelector('.social__comments');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt.key)) {
    evt.preventDefault();
    closeOverlay();
  }
};

function closeOverlay () {
  overlay.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButton.addEventListener('click', closeOverlay);

const renderComment = (commentData) => {
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

  commentsList.appendChild(newComment);
};

export const renderGallery = (post) => {
  overlay.classList.remove('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
  document.body.classList.add('modal-open');
  commentsCounter.classList.add('hidden');
  moreCommentsButton.classList.add('hidden');

  image.src = post.url;
  likes.textContent = post.likes;
  commentsCount.textContent = post.comments.length;
  postCaption.textContent = post.description;

  for (const value of post.comments) {
    renderComment(value);
  }
};
