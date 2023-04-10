import {isEscapeKey} from './utils.js';

const ALERT_SHOW_TIME = 5000;

let activeOverlay = null;

const closeDialogOverlay = () => {
  activeOverlay.remove();
  activeOverlay = null;
  document.removeEventListener('keydown', onDocumentKeydown);
};

// function для хостинга
function onDocumentKeydown (evt) {
  if (isEscapeKey(evt.key)) {
    evt.preventDefault();
    closeDialogOverlay();
  }
}

const onElementClick = (evt) => {
  if (evt.target.hasAttribute('data-close')) {
    closeDialogOverlay();
  }
};

export const openDialogOverlay = (template) => {
  activeOverlay = template.cloneNode(true);

  document.body.appendChild(activeOverlay);

  document.addEventListener('keydown', onDocumentKeydown);
  activeOverlay.addEventListener('click', onElementClick);
};

export const isDialogOpen = () => activeOverlay !== null;

export const openErrorMessage = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.classList.add('data-error');

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};
