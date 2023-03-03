export const isStringOptimal = (str, maxLength) => str.length <= maxLength; /* Проверка на длину строки */

isStringOptimal('check', 3);

export const isItPalindrome = (str) => str.toLowerCase() === str.toLowerCase().split('').reverse().join(''); /* Проверка на палиндром */

isItPalindrome('Nan');

export const getNumber = (str) => { /* Возвращает все имеющиеся числа в строке в виде одного целого числа */
  let numberStr = '';
  const strNoSpace = str.replaceAll(' ', '');

  for (const char of strNoSpace) {
    if (Number.isInteger(+char)) {
      numberStr += char;
    }
  }

  return numberStr.length === 0 ? NaN : +numberStr;
};

getNumber('2 cats and 3 cows');

export const getOptimalStringWithPad = (str, minLength, pad) => { /* С помощью заданной подкладки доводит длину строки до минимально требуемого значения */
  const requiredPad = minLength - str.length;

  if (requiredPad <= 0) {
    return str;
  }

  return str.slice(0, requiredPad % pad.length) + pad.repeat(requiredPad / pad.length) + str;
};

getOptimalStringWithPad('Ha', 4, 'Ho');

export const getRandomInteger = (a, b) => { /* Возвращает случайное целое число в заданном диапазоне */
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

export const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)]; /* Возвращает случайный элемент массива */
