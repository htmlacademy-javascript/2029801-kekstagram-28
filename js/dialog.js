import {isEscapeKey} from './utils.js';

let activeOverlay = null;

const closeDialogOverlay = () => {
  activeOverlay.remove();
  activeOverlay = null;
  document.removeEventListener('keydown', onDocumentKeydown);
};

// function для хостинга
function onDocumentKeydown (evt) {
  evt.preventDefault();
  if (isEscapeKey(evt.key)) {
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
