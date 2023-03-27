import {isEscapeKey} from './utils.js';
import {openDialogOverlay} from './dialog.js';
import {isDialogOpen} from './dialog.js';

const createPostForm = document.querySelector('.img-upload__form');
const createPostButton = createPostForm.querySelector('.img-upload__control');
const formOverlay = createPostForm.querySelector('.img-upload__overlay');
const closeOverlayButton = createPostForm.querySelector('.img-upload__cancel');
const hashTag = /^#[a-zа-яё0-9]{1,19}$/i;
const hashTagsField = createPostForm.querySelector('.text__hashtags');
const descriptionField = createPostForm.querySelector('.text__description');
const errorMessageTemplate = document.querySelector('#error').content;
const errorMessageOverlay = errorMessageTemplate.querySelector('.error');
const successMessageTemplate = document.querySelector('#success').content;
const successMessageOverlay = successMessageTemplate.querySelector('.success');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt.key) && !isDialogOpen()) {
    evt.preventDefault();
    closeForm();
  }
};

const onFieldKeydown = (evt) => {
  evt.stopPropagation();
};

const clearForm = () => {
  createPostForm.reset();
};

const isHashTagsCorrect = (hashTags) => {
  const hashTagsList = hashTags.split(' ');

  if (hashTagsList[0] === '') {
    return true;
  }

  if (hashTagsList.length > 5) {
    return false;
  }

  for (const value of hashTagsList) {
    if (hashTag.test(value) === false) {
      return false;
    }

    if (hashTagsList.indexOf(value) !== hashTagsList.lastIndexOf(value)) {
      return false;
    }
  }

  return true;
};

const openForm = () => {
  document.body.classList.add('modal-open');
  formOverlay.classList.remove('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
  descriptionField.addEventListener('keydown', onFieldKeydown);
  hashTagsField.addEventListener('keydown', onFieldKeydown);
};

function closeForm () {
  document.body.classList.remove('modal-open');
  formOverlay.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
}

closeOverlayButton.addEventListener('click', closeForm);
createPostButton.addEventListener('click', openForm);

const pristine = new Pristine(createPostForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text__error-message',
});

pristine.addValidator(hashTagsField, isHashTagsCorrect, 'Неверный формат, повторение или задано больше 5 хэштэгов');

createPostForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    openDialogOverlay(successMessageOverlay);
    clearForm();
  } else {
    openDialogOverlay(errorMessageOverlay);
  }
});

