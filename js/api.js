const GET_URL = 'https://28.javascript.pages.academy/kekstagram/data';
const SEND_URL = 'https://28.javascript.pages.academy/kekstagram';
const GET_ERROR_TEXT = 'Ошибка загрузки данных. Попробуйте перезагрузить страницу';
const SEND_ERROR_TEXT = 'Ошибка отправки данных. Попробуйте еще раз';

export const getData = (onSuccess, onError) => fetch(
  GET_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  })
  .then(onSuccess)
  .catch(() => {
    onError(GET_ERROR_TEXT);
  });

export const sendData = (body, onSuccess, onError) => fetch(
  SEND_URL,
  {
    method: 'POST',
    body,
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(SEND_ERROR_TEXT);
    }

    onSuccess();
  })
  .catch(() => {
    onError();
  });
