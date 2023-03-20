import {createPost} from './post-data.js';
import {createPostsData} from './post-data.js';
import {renderPosts} from './create-post.js';
import {renderGallery} from './gallery.js';

const posts = createPostsData(25);
const post = createPost(1);

renderPosts(posts);
renderGallery(post);
