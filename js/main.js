import './post-data.js';
import './utils.js';
import {createPostBase} from './post-data.js';
import {renderPosts} from './create-post.js';

renderPosts(createPostBase(25));
