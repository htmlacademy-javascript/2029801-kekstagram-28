import {isEscapeKey} from './utils.js';
import {openDialogOverlay} from './dialog.js';
import {isDialogOpen} from './dialog.js';
import {sendData} from './api.js';

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

const createArticleForm = document.querySelector('.img-upload__form');
const createPostButton = createArticleForm.querySelector('.img-upload__control');
const formOverlay = createArticleForm.querySelector('.img-upload__overlay');
const closeOverlayButton = createArticleForm.querySelector('.img-upload__cancel');
const uploadImage = createArticleForm.querySelector('.img-upload__image');
const hashTagsField = createArticleForm.querySelector('.text__hashtags');
const descriptionField = createArticleForm.querySelector('.text__description');
const errorMessageTemplate = document.querySelector('#error').content;
const errorMessageOverlay = errorMessageTemplate.querySelector('.error');
const successMessageTemplate = document.querySelector('#success').content;
const successMessageOverlay = successMessageTemplate.querySelector('.success');
const scaleValueField = document.querySelector('.scale__control--value');
const raiseScaleButton = document.querySelector('.scale__control--bigger');
const decreaseScaleButton = document.querySelector('.scale__control--smaller');
const sliderContainer = createArticleForm.querySelector('.img-upload__effect-level');
const sliderElement = createArticleForm.querySelector('.effect-level__slider');
const filterValueElement = createArticleForm.querySelector('.effect-level__value');
const imageFiltersList = createArticleForm.querySelector('.effects__list');
const submitButton = createArticleForm.querySelector('.img-upload__submit');

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
  uploadImage.style.transform = `scale(${percentValue})`;
  scaleValueField.value = `${value}%`;
};

const onScaleButtonClick = (evt) => {
  let currentScaleValue = parseInt(scaleValueField.value, 10);

  if (evt.target === raiseScaleButton && currentScaleValue < MAX_SCALE_VALUE) {
    currentScaleValue += SCALE_STEP;
  } else if (evt.target === decreaseScaleButton && currentScaleValue > MIN_SCALE_VALUE) {
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
    uploadImage.style.filter = `${currentFilterSettings.effect}(${sliderElement.noUiSlider.get()}${currentFilterSettings.units})`;
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
  uploadImage.classList.remove(`effects__preview--${currentFilter}`);

  sliderElement.noUiSlider.reset();

  uploadImage.removeAttribute('style');
  currentFilter = 'none';
  filterValueElement.value = '';
};

const onFilterButtonClick = (evt) => {
  uploadImage.classList.remove(`effects__preview--${currentFilter}`);

  currentFilter = evt.target.value;

  uploadImage.classList.add(`effects__preview--${currentFilter}`);

  const currentFilterSettings = imageFilters[currentFilter];

  if (evt.target.value !== 'none') {
    setFilterSettingsToSlider(currentFilterSettings);
    sliderContainer.classList.remove('hidden');
  } else {
    sliderContainer.classList.add('hidden');
    clearImageFilter();
  }
};

const clearForm = () => {
  createArticleForm.reset();
  clearImageFilter();
  setImageScale(INITIAL_SCALE);
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

// function для хостинга
function closeForm () {
  document.body.classList.remove('modal-open');
  formOverlay.classList.add('hidden');
  uploadImage.classList.remove(`effects__preview--${currentFilter}`);

  document.removeEventListener('keydown', onDocumentKeydown);

  clearForm();
}

const onOpenFormButtonClick = () => {
  openForm();
};

const onCloseFormButtonClick = () => {
  closeForm();
};

const toggleSubmitCTAState = (isSubmitButtonDisable) => {
  if (!isSubmitButtonDisable) {
    submitButton.disabled = true;
    submitButton.textContent = 'Публикация...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
  }
};

closeOverlayButton.addEventListener('click', onCloseFormButtonClick);
createPostButton.addEventListener('click', onOpenFormButtonClick);

const pristine = new Pristine(createArticleForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text__error-message',
});

pristine.addValidator(hashTagsField, isHashTagsCorrect, FIELD_ERROR_MESSAGE);

const onSubmitFormSuccess = () => {
  openDialogOverlay(successMessageOverlay);
  toggleSubmitCTAState(submitButton.disabled);
};

const onSubmitFormError = () => {
  openDialogOverlay(errorMessageOverlay);
  toggleSubmitCTAState(submitButton.disabled);
};

createArticleForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    toggleSubmitCTAState(submitButton.disabled);
    sendData(new FormData(evt.target), onSubmitFormSuccess, onSubmitFormError);
    clearForm();
  }
});
