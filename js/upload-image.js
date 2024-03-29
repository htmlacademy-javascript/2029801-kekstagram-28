import {openForm} from './form.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const IMAGE_PROPERTY = '--background-source';

const fileChooserElement = document.querySelector('.img-upload__input[type=file]');
const previewElement = document.querySelector('.img-upload__image');
const effectsContainerElement = document.querySelector('.effects__list');

export const setThumbnailsImage = (source) => {
  if (source) {
    effectsContainerElement.style.setProperty(IMAGE_PROPERTY, `url(${source})`);
  } else {
    effectsContainerElement.style.removeProperty(IMAGE_PROPERTY);
  }
};

fileChooserElement.addEventListener('change', () => {
  openForm();
  const file = fileChooserElement.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    previewElement.src = URL.createObjectURL(file);

    setThumbnailsImage(URL.createObjectURL(file));
  }
});
