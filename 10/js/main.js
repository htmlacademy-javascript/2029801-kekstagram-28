import {savePhotosData} from './photos-data.js';
import './form.js';
import {getData} from './api.js';
import {openErrorMessage} from './dialog.js';
import {renderPosts} from './create-post.js';
import {unblockFilters} from './filters.js';
import './upload-image.js';

const onGetPostSuccess = (postData) => {
  savePhotosData(postData);
  renderPosts(postData);
  unblockFilters();
};

const onGetPostError = (errorMessage) => {
  openErrorMessage(errorMessage);
};

getData(onGetPostSuccess, onGetPostError);

