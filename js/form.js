import {isEscapeKey} from './utils.js';
import {openDialogOverlay} from './dialog.js';
import {isDialogOpen} from './dialog.js';

const HASH_TAG = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_HASH_TAG_COUNT = 5;
const FIELD_ERROR_MESSAGE = `Неверный формат, повторение или задано больше ${MAX_HASH_TAG_COUNT} хэштэгов`;
const SCALE_STEP = 25;
const MIN_SCALE_VALUE = 25;
const MAX_SCALE_VALUE = 100;
const SCALE_PERCENT_DIVIDER = 100;
const INITIAL_SLIDER_CONFIG = {
  min: 0,
  max: 1,
  step: 0.1,
  connect: 'lower',
  units: '',
  effect: ''
};

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

let currentFilter = 'none';

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
  evt.preventDefault();

  if (isEscapeKey(evt.key) && !isDialogOpen()) {
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

  const convertToPercent = () => currentScaleValue / SCALE_PERCENT_DIVIDER;
  const setImageScale = () => {
    uploadImage.style.transform = `scale(${convertToPercent()})`;
    scaleValueField.value = `${currentScaleValue}%`;
  };

  if (evt.target === raiseScaleButton && currentScaleValue < MAX_SCALE_VALUE) {
    currentScaleValue += SCALE_STEP;
    convertToPercent();
    setImageScale();
  } else if (evt.target === decreaseScaleButton && currentScaleValue > MIN_SCALE_VALUE) {
    currentScaleValue -= SCALE_STEP;
    convertToPercent();
    setImageScale();
  }
};

noUiSlider.create(sliderElement, {
  start: INITIAL_SLIDER_CONFIG.max,
  range: {
    'min': INITIAL_SLIDER_CONFIG.min,
    'max': INITIAL_SLIDER_CONFIG.max,
  },
  step: INITIAL_SLIDER_CONFIG.step,
  connect: INITIAL_SLIDER_CONFIG.connect,
});

const setFilterSettingsToSlider = (filter) => {
  const currentFilterSettings = imageFilters[filter];
  uploadImage.classList.add(`effects__preview--${currentFilter}`);

  sliderElement.noUiSlider.updateOptions({
    range: {
      min: currentFilterSettings.min,
      max: currentFilterSettings.max
    },
    start: currentFilterSettings.max,
    step: currentFilterSettings.step
  });

  sliderElement.noUiSlider.on('update', () => {
    filterValueElement.value = sliderElement.noUiSlider.get();
    uploadImage.style.filter = `${currentFilterSettings.effect}(${sliderElement.noUiSlider.get()}${currentFilterSettings.units})`;
  });
};

const onFilterButtonClick = (evt) => {
  uploadImage.classList.remove(`effects__preview--${currentFilter}`);
  currentFilter = evt.target.value;

  if (evt.target.value !== 'none') {
    setFilterSettingsToSlider(currentFilter);
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
  imageFiltersList.addEventListener('change', onFilterButtonClick);
};

const clearImageFilter = () => {
  uploadImage.classList.remove(`effects__preview--${currentFilter}`);

  sliderElement.noUiSlider.updateOptions({
    range: {
      'min': INITIAL_SLIDER_CONFIG.min,
      'max': INITIAL_SLIDER_CONFIG.max,
    },
    start: INITIAL_SLIDER_CONFIG.max,
    step: INITIAL_SLIDER_CONFIG.step,
    connect: INITIAL_SLIDER_CONFIG.connect,
  });

  uploadImage.style.filter = null;
  currentFilter = 'none';
  filterValueElement.value = '';
};

// function для хостинга
function closeForm () {
  document.body.classList.remove('modal-open');
  formOverlay.classList.add('hidden');
  uploadImage.classList.remove(`effects__preview--${currentFilter}`);

  document.removeEventListener('keydown', onDocumentKeydown);

  clearImageFilter();
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

