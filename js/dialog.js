import {isEscapeKey} from './utils.js';

const ALERT_SHOW_TIME = 5000;

let activeOverlayElement = null;

const closeDialogOverlay = () => {
  activeOverlayElement.remove();
  activeOverlayElement = null;
  document.removeEventListener('keydown', onDocumentKeydown);
};

// function для хостинга
function onDocumentKeydown (evt) {
  if (isEscapeKey(evt.key)) {
    evt.preventDefault();
    closeDialogOverlay();
  }
}

const onCloseDialogElementClick = (evt) => {
  if (evt.target.hasAttribute('data-close')) {
    closeDialogOverlay();
  }
};

export const openDialogOverlay = (template) => {
  activeOverlayElement = template.cloneNode(true);

  document.body.appendChild(activeOverlayElement);

  document.addEventListener('keydown', onDocumentKeydown);
  activeOverlayElement.addEventListener('click', onCloseDialogElementClick);
};

export const isDialogOpen = () => activeOverlayElement !== null;

export const openErrorMessage = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.classList.add('data-error');

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};
