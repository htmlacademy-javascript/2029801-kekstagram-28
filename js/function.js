const isStringOptimal = (str, maxLength) => str.length <= maxLength; /* Проверка на длину строки */

isStringOptimal('check', 3);

const isItPalindrome = (str) => str.toLowerCase() === str.toLowerCase().split('').reverse().join(''); /* Проверка на палиндром */

isItPalindrome('Nan');

const getNumber = (str) => { /* Возвращает все имеющиеся числа в строке в виде одного целого числа */
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

const doOptimalString = function (string, minLength, pad) { /* С помощью заданной подкладки доводит длину строки до минимально требуемого значения */
  const requiredPad = minLength - string.length;

  if (requiredPad <= 0) {
    return string;
  }

  return string.slice(0, requiredPad % pad.length) + pad.repeat(requiredPad / pad.length) + string;
};

doOptimalString('Ha', 4, 'Ho');
