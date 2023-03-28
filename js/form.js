import {isEscapeKey} from './utils.js';
import {openDialogOverlay} from './dialog.js';
import {isDialogOpen} from './dialog.js';

const HASH_TAG = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_HASH_TAG_COUNT = 5;
const FIELD_ERROR_MESSAGE = `Неверный формат, повторение или задано больше ${MAX_HASH_TAG_COUNT} хэштэгов`;

const createPostForm = document.querySelector('.img-upload__form');
const createPostButton = createPostForm.querySelector('.img-upload__control');
const formOverlay = createPostForm.querySelector('.img-upload__overlay');
const closeOverlayButton = createPostForm.querySelector('.img-upload__cancel');
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

const onFormFieldKeydown = (evt) => {
  if (isEscapeKey(evt.key)) {
    evt.stopPropagation();
  }
};

const clearForm = () => {
  createPostForm.reset();
};

const isHashTagsCorrect = (hashTags) => {
  const trimmedText = hashTags.trim();

  if (!trimmedText) {
    return true;
  }

  const hashTagsList = hashTags.split('#');

  if (hashTagsList.length > MAX_HASH_TAG_COUNT) {
    return false;
  }

  for (const value of hashTagsList) {
    if (!HASH_TAG.test(value) || hashTagsList.indexOf(value) !== hashTagsList.lastIndexOf(value)) {
      return false;
    }
  }

  return true;
};

const openForm = () => {
  document.body.classList.add('modal-open');
  formOverlay.classList.remove('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
  descriptionField.addEventListener('keydown', onFormFieldKeydown);
  hashTagsField.addEventListener('keydown', onFormFieldKeydown);
};

function closeForm () { /* function для хостинга */
  document.body.classList.remove('modal-open');
  formOverlay.classList.add('hidden');

  document.removeEventListener('keydown', onDocumentKeydown);
}

const onOpenFormButtonClick = () => {
  openForm();
};

const onCloseFormButtonClick = () => {
  closeForm();
};

closeOverlayButton.addEventListener('click', onCloseFormButtonClick);
createPostButton.addEventListener('click', onOpenFormButtonClick);

const pristine = new Pristine(createPostForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text__error-message',
});

pristine.addValidator(hashTagsField, isHashTagsCorrect, FIELD_ERROR_MESSAGE);

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

