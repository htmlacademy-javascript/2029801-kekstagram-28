import {getRandomArrayElement} from './utils';
import {getRandomInteger} from './utils';

const COMMENT_OPTIONS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const NAMES = [
  'Иван',
  'Марья',
  'Никита',
  'Александр',
  'Петр',
  'Кекс',
  'Дарья'
];
const AVATARS_DIAPASONE_MIN = 0;
const AVATARS_DIAPASONE_MAX = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MAX_COMMENTS = 3;

const createComment = (id) => ({
  id,
  avatar: `img/avatar-${getRandomInteger(AVATARS_DIAPASONE_MIN, AVATARS_DIAPASONE_MAX)}.svg`,
  message: getRandomArrayElement(COMMENT_OPTIONS),
  name: getRandomArrayElement(NAMES)
});

const createPost = (id) => ({
  id,
  url: `photos/${id}.jpg`,
  desription: 'Очередной новый пост',
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: Array.from({length: MAX_COMMENTS}, (_, i) => createComment(i))
});

export const createPostBase = (count) => Array.from({length: count}, (_, i) => createPost(i + 1));

createPostBase(25);
