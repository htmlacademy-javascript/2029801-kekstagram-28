const GET_URL = 'https://28.javascript.pages.academy/kekstagram/data';
const SEND_URL = 'https://28.javascript.pages.academy/kekstagram';

export const getData = (onSuccess, onError) => fetch(
  GET_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных. Пожалуйста перезагрузите страницу');
    }
    return response.json();
  })
  .then((postsData) => {
    onSuccess(postsData);
  })
  .catch(() => {
    onError('Ошибка загрузки данных. Попробуйте перезагрузить страницу');
  });

export const sendData = (body, onSuccess, onError) => fetch(
  SEND_URL,
  {
    method: 'POST',
    body,
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Ошибка отправки данных. Попробуйте еще раз');
    }
    onSuccess();
  })
  .catch(() => {
    onError();
  });
