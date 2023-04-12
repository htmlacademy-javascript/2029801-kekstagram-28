import {isEscapeKey} from './utils.js';

const AVATAR_WIDTH = '35';
const AVATAR_HEIGHT = '35';
const DEFAULT_COMMENTS_COUNT = 5;

const overlay = document.querySelector('.big-picture');
const closeButton = overlay.querySelector('.big-picture__cancel');
const imageContainer = overlay.querySelector('.big-picture__img');
const image = imageContainer.querySelector('img');
const likesCounter = overlay.querySelector('.likes-count');
const commentsCount = overlay.querySelector('.comments-count');
const moreCommentsButton = overlay.querySelector('.comments-loader');
const postCaption = overlay.querySelector('.social__caption');
const commentsList = overlay.querySelector('.social__comments');
const postTemplate = document.querySelector('#picture').content;
let commentsSliceCounter = DEFAULT_COMMENTS_COUNT;
let currentPost = null;

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt.key)) {
    evt.preventDefault();
    closeOverlay();
  }
};

// function для хостинга
function closeOverlay () {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButton.addEventListener('click', closeOverlay);

export const createPostElement = (postBaseElement) => {
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
  for (const value of commentsData) {
    const newComment = createComment(value);

    commentsList.appendChild(newComment);
  }

  if (commentsData.length === currentPost.comments.length) {
    moreCommentsButton.classList.add('hidden');
  }

  commentsCount.textContent = `${commentsData.length} из ${currentPost.comments.length}`;
};

const onMoreCommentsButtonClick = () => {
  commentsSliceCounter += DEFAULT_COMMENTS_COUNT;
  const slicedComments = currentPost.comments.slice(0, commentsSliceCounter);
  commentsList.innerHTML = '';

  renderComments(slicedComments);
};

moreCommentsButton.addEventListener('click', onMoreCommentsButtonClick);

export const openPost = (post) => {
  overlay.classList.remove('hidden');

  currentPost = post;
  const {url, description, likes, comments} = currentPost;
  commentsSliceCounter = DEFAULT_COMMENTS_COUNT;
  const slicedComments = comments.slice(0, commentsSliceCounter);

  document.addEventListener('keydown', onDocumentKeydown);
  document.body.classList.add('modal-open');

  if (slicedComments.length < comments.length) {
    moreCommentsButton.classList.remove('hidden');
  }

  commentsCount.textContent = comments.length;
  image.src = url;
  likesCounter.textContent = likes;
  postCaption.textContent = description;
  commentsList.innerHTML = '';

  renderComments(slicedComments);
};

