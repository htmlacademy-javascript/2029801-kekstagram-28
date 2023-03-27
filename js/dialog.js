import {isEscapeKey} from './utils.js';

let activeOverlay = null;

const closeDialogOverlay = () => {
  activeOverlay.remove();
  activeOverlay = null;
  document.removeEventListener('keydown', onDocumentKeydown);
};

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
  const confirmButton = activeOverlay.querySelector('.dialog__button');

  document.body.appendChild(activeOverlay);

  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onElementClick);
  confirmButton.addEventListener('click', closeDialogOverlay);
};

export const isDialogOpen = () => activeOverlay !== null;
