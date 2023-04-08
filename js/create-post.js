const postContainer = document.querySelector('.pictures');
const postTemplate = document.querySelector('#picture').content;

const createPostElement = (postBaseElement) => {
  const newPost = postTemplate.cloneNode(true);
  const postImage = newPost.querySelector('.picture__img');
  const postComments = newPost.querySelector('.picture__comments');
  const postLikes = newPost.querySelector('.picture__likes');

  postImage.src = postBaseElement.url;
  postComments.textContent = postBaseElement.comments.length;
  postLikes.textContent = postBaseElement.likes;

  return newPost;
};

export const onGetPostSuccess = (postData) => {
  const postListFragment = document.createDocumentFragment();

  for (const value of postData) {
    const newPost = createPostElement(value);
    postListFragment.appendChild(newPost);
  }

  postContainer.appendChild(postListFragment);
};
