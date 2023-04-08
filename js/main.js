import {onGetPostSuccess} from './create-post.js';
import './form.js';
import {getData} from './api.js';
import {onGetPostError} from './utils.js';

getData(onGetPostSuccess, onGetPostError);

