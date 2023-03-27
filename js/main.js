import {createPostsData} from './post-data.js';
import {renderPosts} from './create-post.js';

const posts = createPostsData(25);

renderPosts(posts);
