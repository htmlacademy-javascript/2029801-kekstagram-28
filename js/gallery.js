import {isEscapeKey} from './utils.js';

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
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    overlay.classList.add('hidden');
  }
};

export const renderGallery = (post) => {
  overlay.classList.remove('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.addEventListener('click', () => {
    overlay.classList.add('hidden');
  });

  document.body.classList.add('modal-open');
  commentsCounter.classList.add('hidden');
  moreCommentsButton.classList.add('hidden');

  image.src = post.url;
  likes.textContent = post.likes;
  commentsCount.textContent = post.comments.length;
  postCaption.textContent = post.description;

  for (const value of post.comments) {
    const newComment = document.createElement('li');
    newComment.classList.add('social__comment');

    const commentatorAvatar = document.createElement('img');
    commentatorAvatar.classList.add('social__picture');
    commentatorAvatar.src = value.avatar;
    commentatorAvatar.alt = value.name;
    commentatorAvatar.width = '35';
    commentatorAvatar.height = '35';
    newComment.appendChild(commentatorAvatar);

    const commentText = document.createElement('p');
    commentText.classList.add('social__text');
    commentText.textContent = value.message;
    newComment.appendChild(commentText);

    commentsList.appendChild(newComment);
  }
};
