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
const uploadImage = createPostForm.querySelector('.img-upload__image');
const hashTagsField = createPostForm.querySelector('.text__hashtags');
const descriptionField = createPostForm.querySelector('.text__description');
const errorMessageTemplate = document.querySelector('#error').content;
const errorMessageOverlay = errorMessageTemplate.querySelector('.error');
const successMessageTemplate = document.querySelector('#success').content;
const successMessageOverlay = successMessageTemplate.querySelector('.success');
const scaleValueField = document.querySelector('.scale__control--value');
const raiseScaleButton = document.querySelector('.scale__control--bigger');
const decreaseScaleButton = document.querySelector('.scale__control--smaller');
const sliderContainer = createPostForm.querySelector('.img-upload__effect-level');
const sliderElement = createPostForm.querySelector('.effect-level__slider');
const filterValueElement = createPostForm.querySelector('.effect-level__value');
const imageFiltersList = createPostForm.querySelector('.effects__list');
const originalImageFilterButton = createPostForm.querySelector('.effects__radio--original');
let currentFilter = null;

const imageFilters = {
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    units: '',
    effect: 'grayscale'
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    units: '',
    effect: 'sepia'
  },
  marvin: {
    min: 0,
    max: 1,
    step: 0.1,
    units: '',
    effect: 'invert'
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    units: 'px',
    effect: 'blur'
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    units: '',
    effect: 'brightness'
  }
};

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

const onScaleButtonClick = (evt) => {
  let currentScaleValue = parseInt(scaleValueField.value, 10);

  if (evt.target === raiseScaleButton && currentScaleValue < 100) {
    currentScaleValue += 25;
  } else if (evt.target === decreaseScaleButton && currentScaleValue > 25) {
    currentScaleValue -= 25;
  }

  const scalePercent = currentScaleValue / 100;
  uploadImage.style.transform = `scale(${scalePercent})`;
  scaleValueField.value = `${currentScaleValue}%`;
};

const createFilterSlider = (filter) => {
  currentFilter = imageFilters[filter];
  uploadImage.classList.add(`effects__preview--${filter}`);

  noUiSlider.create(sliderElement, {
    start: currentFilter.max,
    range: {
      'min': currentFilter.min,
      'max': currentFilter.max,
    },
    step: currentFilter.step,
    connect: 'lower',
  });

  sliderElement.noUiSlider.on('update', () => {
    filterValueElement.value = sliderElement.noUiSlider.get();
    uploadImage.style.filter = `${currentFilter.effect}(${sliderElement.noUiSlider.get()}${currentFilter.units})`;
  });
};

const onFilterButtonClick = (evt) => {
  if (evt.target.closest('.effects__radio') && evt.target.closest('.effects__radio') !== originalImageFilterButton) {
    const selectedFilter = evt.target.value;
    createFilterSlider(selectedFilter);
    sliderContainer.classList.remove('hidden');
  } else {
    sliderContainer.classList.add('hidden');
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
  sliderContainer.classList.add('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
  descriptionField.addEventListener('keydown', onFormFieldKeydown);
  hashTagsField.addEventListener('keydown', onFormFieldKeydown);
  raiseScaleButton.addEventListener('click', onScaleButtonClick);
  decreaseScaleButton.addEventListener('click', onScaleButtonClick);
  imageFiltersList.addEventListener('click', onFilterButtonClick);
};

// function для хостинга
function closeForm () {
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

