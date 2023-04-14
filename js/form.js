import {isEscapeKey} from './utils.js';
import {openDialogOverlay} from './dialog.js';
import {isDialogOpen} from './dialog.js';
import {sendData} from './api.js';
import {setThumbnailsImage} from './upload-image.js';

const HASH_TAG = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_HASH_TAG_COUNT = 5;
const FIELD_ERROR_MESSAGE = `Неверный формат, повторение или задано больше ${MAX_HASH_TAG_COUNT} хэштэгов`;
const INITIAL_SCALE = 100;
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
const DEFAULT_IMAGE_URL = '../img/upload-default-image.jpg';

const createArticleFormElement = document.querySelector('.img-upload__form');
const formOverlayElement = createArticleFormElement.querySelector('.img-upload__overlay');
const closeOverlayButtonElement = createArticleFormElement.querySelector('.img-upload__cancel');
const uploadImageElement = createArticleFormElement.querySelector('.img-upload__image');
const hashTagsFieldElement = createArticleFormElement.querySelector('.text__hashtags');
const descriptionFieldElement = createArticleFormElement.querySelector('.text__description');
const errorMessageTemplateElement = document.querySelector('#error').content;
const errorMessageOverlayElement = errorMessageTemplateElement.querySelector('.error');
const successMessageTemplateElement = document.querySelector('#success').content;
const successMessageOverlayElement = successMessageTemplateElement.querySelector('.success');
const scaleValueFieldElement = document.querySelector('.scale__control--value');
const raiseScaleButtonElement = document.querySelector('.scale__control--bigger');
const decreaseScaleButtonElement = document.querySelector('.scale__control--smaller');
const sliderContainerElement = createArticleFormElement.querySelector('.img-upload__effect-level');
const sliderElement = createArticleFormElement.querySelector('.effect-level__slider');
const filterValueElement = createArticleFormElement.querySelector('.effect-level__value');
const imageFiltersListElement = createArticleFormElement.querySelector('.effects__list');
const submitButtonElement = createArticleFormElement.querySelector('.img-upload__submit');
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

let currentFilter = 'none';

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

const setImageScale = (value) => {
  const percentValue = value / SCALE_PERCENT_DIVIDER;
  uploadImageElement.style.transform = `scale(${percentValue})`;
  scaleValueFieldElement.value = `${value}%`;
};

const onScaleButtonClick = (evt) => {
  let currentScaleValue = parseInt(scaleValueFieldElement.value, 10);

  if (evt.target === raiseScaleButtonElement && currentScaleValue < MAX_SCALE_VALUE) {
    currentScaleValue += SCALE_STEP;
  } else if (evt.target === decreaseScaleButtonElement && currentScaleValue > MIN_SCALE_VALUE) {
    currentScaleValue -= SCALE_STEP;
  }

  setImageScale(currentScaleValue);
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

sliderElement.noUiSlider.on('update', () => {
  if (currentFilter !== 'none') {
    const currentFilterSettings = imageFilters[currentFilter];
    filterValueElement.value = sliderElement.noUiSlider.get();
    uploadImageElement.style.filter = `${currentFilterSettings.effect}(${sliderElement.noUiSlider.get()}${currentFilterSettings.units})`;
  }
});

const setFilterSettingsToSlider = (filterSettings) => {
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: filterSettings.min,
      max: filterSettings.max
    },
    start: filterSettings.max,
    step: filterSettings.step
  });
};

const clearImageFilter = () => {
  uploadImageElement.classList.remove(`effects__preview--${currentFilter}`);

  sliderElement.noUiSlider.reset();

  uploadImageElement.removeAttribute('style');
  currentFilter = 'none';
  filterValueElement.value = '';
};

const onFilterButtonClick = (evt) => {
  uploadImageElement.classList.remove(`effects__preview--${currentFilter}`);

  currentFilter = evt.target.value;

  uploadImageElement.classList.add(`effects__preview--${currentFilter}`);

  const currentFilterSettings = imageFilters[currentFilter];

  if (evt.target.value !== 'none') {
    setFilterSettingsToSlider(currentFilterSettings);
    sliderContainerElement.classList.remove('hidden');
  } else {
    sliderContainerElement.classList.add('hidden');
    clearImageFilter();
  }
};

const clearForm = () => {
  createArticleFormElement.reset();
  clearImageFilter();
  setImageScale(INITIAL_SCALE);
  setThumbnailsImage(null);

  uploadImageElement.src = DEFAULT_IMAGE_URL;
};

const isHashTagsCorrect = (hashTags) => {
  const trimmedText = hashTags.trim();

  if (!trimmedText) {
    return true;
  }

  const hashTagsList = trimmedText.split(' ');

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

export const openForm = () => {
  document.body.classList.add('modal-open');
  formOverlayElement.classList.remove('hidden');
  sliderContainerElement.classList.add('hidden');

  document.addEventListener('keydown', onDocumentKeydown);
  descriptionFieldElement.addEventListener('keydown', onFormFieldKeydown);
  hashTagsFieldElement.addEventListener('keydown', onFormFieldKeydown);
  raiseScaleButtonElement.addEventListener('click', onScaleButtonClick);
  decreaseScaleButtonElement.addEventListener('click', onScaleButtonClick);
  imageFiltersListElement.addEventListener('change', onFilterButtonClick);
};

// function для хостинга
function closeForm () {
  document.body.classList.remove('modal-open');
  formOverlayElement.classList.add('hidden');
  uploadImageElement.classList.remove(`effects__preview--${currentFilter}`);

  document.removeEventListener('keydown', onDocumentKeydown);

  clearForm();
}

const onCloseFormButtonClick = () => {
  closeForm();
};

const toggleSubmitCTAState = (isSubmitButtonDisable) => {
  if (isSubmitButtonDisable) {
    submitButtonElement.disabled = true;
    submitButtonElement.textContent = 'Публикация...';
  } else {
    submitButtonElement.disabled = false;
    submitButtonElement.textContent = 'Опубликовать';
  }
};

closeOverlayButtonElement.addEventListener('click', onCloseFormButtonClick);

const pristine = new Pristine(createArticleFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text__error-message',
});

pristine.addValidator(hashTagsFieldElement, isHashTagsCorrect, FIELD_ERROR_MESSAGE);

const onSubmitFormSuccess = () => {
  openDialogOverlay(successMessageOverlayElement);
  toggleSubmitCTAState(false);
  clearForm();
  closeForm();
};

const onSubmitFormError = () => {
  openDialogOverlay(errorMessageOverlayElement);
  toggleSubmitCTAState(false);
};

createArticleFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    const formData = new FormData(evt.target);

    toggleSubmitCTAState(true);
    sendData(formData, onSubmitFormSuccess, onSubmitFormError);
  }
});
