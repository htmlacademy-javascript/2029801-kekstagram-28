import {savePhotosData} from './get-data.js';
import './form.js';
import {getData} from './api.js';
import {onGetPostError} from './dialog.js';
import {renderPosts} from './create-post.js';

const onGetPostSuccess = (postData) => {
  savePhotosData(postData);
  renderPosts(postData);
};

getData(onGetPostSuccess, onGetPostError);

